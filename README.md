# Paseo You're Looping

A tiny [Paseo](https://paseo.sh) plugin that adds a **“You're looping”** button to the agent composer.

When pressed, it:

1. Stops the current agent execution, if one is running.
2. Sends a new message:

> You're looping

That’s it. :)

## Install

```bash
paseo plugin add 721p/paseo-youre-looping
```

Then make sure plugins are enabled in **Paseo → Settings → Plugins**.

If your Paseo daemon is password-protected:

```bash
PASEO_PASSWORD="your-password" paseo plugin add 721p/paseo-youre-looping
```

## Update

```bash
paseo plugin update paseo-youre-looping
```

For a password-protected daemon:

```bash
PASEO_PASSWORD="your-password" paseo plugin update paseo-youre-looping
```

## What it does

The plugin adds a composer pill:

**You're looping**

When clicked, the plugin checks whether the agent currently has an active turn.

If it does, the plugin stops that execution and then sends:

```text
You're looping
```

as a fresh user message.

## Icon

The button uses a repeat-style icon with a red **X** overlay to represent:

```text
stop current loop
      ↓
start a new "You're looping" turn
```

## Development

Clone the repo:

```bash
git clone https://github.com/721p/paseo-youre-looping.git
cd paseo-youre-looping
```

Install dependencies:

```bash
npm install
```

Type-check:

```bash
npm run typecheck
```

Install the local development copy:

```bash
paseo plugin install "$(pwd)"
```

After making changes:

```bash
npm run typecheck
paseo plugin reload paseo-youre-looping
```

## Security

Paseo plugins are trusted code. Plugin server code runs on the daemon host, so only install plugins you trust.

Do not commit:

- Paseo passwords
- API keys
- Tokens
- `.env` files containing secrets

## License

MIT