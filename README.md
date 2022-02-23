# candy-interface

Candybox frontend application.

- Mainnet: https://candybox.money
- Rinkeby: https://rinkeby.candybox.money

## Suggest a feature

Have an idea or suggestion? Create a
[feature request](https://github.com/candyboxdao/candy-interface/issues/new?assignees=&labels=idea&template=feature_request.md&title=%5BIDEA%5D+)
or mention it in the [Discord](https://discord.gg/DCUmdwJemm).

## Report a bug

Notice something broken? Create a
[bug report](https://github.com/candyboxdao/candy-interface/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+).

## Development

### Installation

1. Create a
   [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this
   repository.
1. Clone your fork and navigate to the root directory.
1. Install project dependencies.

   ```bash
   yarn install
   ```

1. Create a `.env` file in the root directory which mirrors the `.example.env`
   file. Learn how to define each field in the `.env` file in [Setup](#setup).

### Setup

`candybox-interface` relies on a number of services for development. Create an
account for each of the following services:

- [Infura](https://infura.io)
- [Pinata](https://pinata.cloud)
- [Blocknative](https://www.blocknative.com)

The following sections describe how to set up each service for local
development.

#### Infura

Candybox uses [Infura](https://infura.io) to connect to an BNB Chain (BSC) network
(mainnet, or one of the testnets).

Take the following steps to create an Infura project for local development:

1. Select **Create New Project** to begin creating a new Infura project.
1. Select the **BNB Chain (BSC)** option from the **Product** dropdown.
1. Enter a **Name** (for example, `candybox-local`).
1. Select **Create** to create the project.

Next, copy the following fields into your `.env` file:

- **Project ID**. In the `.env` file, copy the **Project ID** into the
  `REACT_APP_INFURA_ID` variable.
- **Endpoint**. This is the BNB Chain (BSC) network that will be used for testing. If
  you don't know which endpoint to use, select **mainnet**. In the `.env` file,
  copy the network name (e.g. 'mainnet', not the url) into the `REACT_APP_INFURA_NETWORK` variable.

#### Piñata

Candybox uses [Piñata](https://pinata.cloud) to store project metadata. Candybox
projects set a name, description, logo, and other details when creating the
project. These details are saved on IPFS as a JSON file using Piñata, and the
CID gets stored on-chain with the Candybox project.

Take the following steps to set up Piñata for local development:

1. Create a Piñata API key
   ([learn more](https://docs.pinata.cloud/#your-api-keys)).
   - Enable the **Admin** toggle in the **Admin** field.
1. Copy the following fields into your `.env` file
   - **API Key**. In the `.env` file, copy the **API Key** into the
     `REACT_APP_PINATA_PINNER_KEY` variable.
   - **API Secret**. In the `.env` file, copy the **API Secret** into the
     `REACT_APP_PINATA_PINNER_SECRET` variable.

#### Blocknative

Candybox uses [Blocknative](https://www.blocknative.com) to onboard users by
enabling wallet selection, connection, wallet checks, and real-time state
updates.

Take the following steps to set up Blocknative for local development:

1. Create a Blocknative API key
   ([learn more](https://docs.blocknative.com/webhook-api#setup-api-key)).
   - Enable the **Admin** toggle in the **Admin** field.
1. Copy the API key into the `REACT_APP_BLOCKNATIVE_API_KEY` variable of the
   `.env` file.

### Usage

1. Start the app.

   ```bash
   yarn start
   ```

## Contributing

If you'd like to contribute code or translations to the repository, check out
[`CONTRIBUTING.md`](CONTRIBUTING.md)

## Web3 Providers

The frontend has two different providers that provide different levels of access
to different chains:

- `readProvider`: used to read from contracts on network of injected provider
  (`.env` file points you at testnet or mainnet)
- `signingProvider`: your personal wallet, connected to via
  [Blocknative](https://docs.blocknative.com/onboard).

## Deployment

Frontend application(s) are deployed automatically on pushes to `main` using
[Fleek](https://app.fleek.co/#/sites/candybox-kovan).

## Theme

The app uses the `SemanticTheme` pattern defined in the
[`src/models/semantic-theme/`](src/models/semantic-theme) directory. This allows
mapping style properties to any number of enumerated `ThemeOption`s. Style
properties are defined in the [`src/constants/theme/`](src/constants/theme)
directory. Theme styles can be accessed via `ThemeContext` defined in
[`src/contexts/themeContext.ts`](src/contexts/themeContext.ts) (and instantiated
in [`src/hooks/CandyTheme.tsx`](src/hooks/CandyTheme.tsx)), or via CSS root
variables.

The app also relies on [antd](https://ant-design.gitee.io/) React components. We
override some Antd styles to make Antd compatible with `SemanticTheme`. These
overrides are defined in the
[`src/styles/antd-overrides/`](src/styles/antd-overrides) directory.
