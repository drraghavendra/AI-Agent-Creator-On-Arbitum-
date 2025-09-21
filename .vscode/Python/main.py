# main.py
import asyncio
import json
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# -------------------------
# CONFIG
# -------------------------
ARBITRUM_RPC = os.getenv("ARBITRUM_RPC", "https://arb-sepolia.g.alchemy.com/v2/your-api-key")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")  # deployer/off-chain agent private key
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")

# Load ABI + deployed addresses (from Hardhat artifacts)
with open("artifacts/AgentRegistry.json") as f:
    agent_registry_abi = json.load(f)["abi"]

with open("artifacts/ARBToken.json") as f:
    arb_token_abi = json.load(f)["abi"]

AGENT_REGISTRY_ADDRESS = os.getenv("AGENT_REGISTRY_ADDRESS")
ARB_TOKEN_ADDRESS = os.getenv("ARB_TOKEN_ADDRESS")

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(ARBITRUM_RPC))
account = w3.eth.account.from_key(PRIVATE_KEY)

# -------------------------
# CONTRACTS
# -------------------------
agent_registry = w3.eth.contract(address=AGENT_REGISTRY_ADDRESS, abi=agent_registry_abi)
arb_token = w3.eth.contract(address=ARB_TOKEN_ADDRESS, abi=arb_token_abi)


# -------------------------
# FUNCTIONS
# -------------------------

def pay_fee_and_register_agent(ipfs_cid: str):
    """
    Registers a new AI agent on-chain by paying ERC-20 fee and calling registerAgent().
    """
    fee = agent_registry.functions.registrationFee().call()

    # 1. Approve ARB tokens
    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
    approve_tx = arb_token.functions.approve(AGENT_REGISTRY_ADDRESS, fee).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 200000,
        "gasPrice": w3.to_wei("0.1", "gwei")
    })
    signed_approve = w3.eth.account.sign_transaction(approve_tx, private_key=PRIVATE_KEY)
    w3.eth.send_raw_transaction(signed_approve.rawTransaction)
    w3.eth.wait_for_transaction_receipt(signed_approve.hash)

    print(f"Approved {fee} ARB tokens for agent registration.")

    # 2. Register agent
    nonce += 1
    register_tx = agent_registry.functions.registerAgent(ipfs_cid).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 400000,
        "gasPrice": w3.to_wei("0.1", "gwei")
    })
    signed_register = w3.eth.account.sign_transaction(register_tx, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_register.rawTransaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print(f"Agent registered with IPFS CID {ipfs_cid}, Tx: {tx_hash.hex()}")
    return receipt


async def listen_to_events():
    """
    Async listener for AgentRegistered events.
    """
    event_filter = agent_registry.events.AgentRegistered.create_filter(fromBlock="latest")
    print("Listening for AgentRegistered events...")

    while True:
        for event in event_filter.get_new_entries():
            args = event["args"]
            print(f"\n[EVENT] New Agent Registered:")
            print(f" - Owner: {args['owner']}")
            print(f" - Agent ID: {args['agentId']}")
            print(f" - CID: {args['ipfsCid']}")

            # TODO: Trigger off-chain AI execution (Python/Rust worker)
            # Example: launch_model(args['ipfsCid'])

        await asyncio.sleep(5)


# -------------------------
# MAIN
# -------------------------

if __name__ == "__main__":
    # Example flow
    cid_example = "QmExampleCID123456"
    pay_fee_and_register_agent(cid_example)

    # Start event loop
    try:
        asyncio.run(listen_to_events())
    except KeyboardInterrupt:
        print("Shutting down listener...")
