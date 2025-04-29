This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## ⚠️ Atenção ao usar Prisma com Next.js

Este projeto utiliza **Next.js com TypeScript**, e isso traz uma particularidade importante ao executar scripts TypeScript diretamente com `ts-node` — como o `prisma/seed.ts`.

### 🧠 Por quê?

O Next.js usa configurações modernas no `tsconfig.json`:

```jsonc
// tsconfig.json
"module": "esnext",
"moduleResolution": "bundler"
```

### Há duas formas de resolver abaixo:

### ✅ Forma simples:

```jsonc
// para ts-node
"module": "commonjs",
"moduleResolution": "node"
```

### ✅✅✅ Como resolver corretamente

👉 Em vez de alterar o `tsconfig.json` principal (e quebrar o build do Next.js), criamos um `tsconfig` separado apenas para o script `seed.ts`.

#### 1. Crie um arquivo: `tsconfig.seed.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "noEmit": true
  },
  "include": ["prisma/seed.ts"]
}
```

#### 2. Adicione a regra no package.json

```json
"prisma": {
  "seed": "ts-node --project tsconfig.seed.json ./prisma/seed.ts"
}
```
