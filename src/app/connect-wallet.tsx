"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton({
  className,
}: {
  className?: string;
}) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        const unsupported = !!chain?.unsupported;

        const label = !connected
          ? "Connect Wallet"
          : unsupported
          ? "Wrong Network"
          : account?.displayName ?? "Wallet";

        const handler = !connected
          ? openConnectModal
          : unsupported
          ? openChainModal
          : openAccountModal;

        return (
          <button
            type="button"
            onClick={handler}
            className={className}
            disabled={!ready}
          >
            {label}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
