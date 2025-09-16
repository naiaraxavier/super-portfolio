import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar usuário
  const user = await prisma.user.create({
    data: {
      username: "naiara123",
      firstName: "Naiara",
      lastName: "Martins",
      email: "naiaraxf@gmail.com",
      bio: "Desenvolvedora Full Stack apaixonada por criar portfólios digitais.",
      avatarUrl: "https://i.imgur.com/ExemploAvatar.png",
      skills: {
        create: [
          {
            name: "React",
            iconUrl: "https://i.imgur.com/ReactIcon.png",
          },
          {
            name: "TypeScript",
            iconUrl: "https://i.imgur.com/TypeScriptIcon.png",
          },
          {
            name: "Next.js",
            iconUrl: "https://i.imgur.com/NextjsIcon.png",
          },
        ],
      },
      projects: {
        create: [
          {
            title: "Portfólio Pessoal",
            description:
              "Meu portfólio online mostrando projetos e habilidades.",
            link: "https://meuportfolio.com",
            imageUrl: "https://i.imgur.com/Projeto1.png",
          },
          {
            title: "Plataforma de Freelancers",
            description: "Sistema para conectar freelancers e clientes.",
            link: "https://freelancerplatform.com",
            imageUrl: "https://i.imgur.com/Projeto2.png",
          },
        ],
      },
      contacts: {
        create: [
          {
            type: "GitHub",
            value: "https://github.com/naiarax",
          },
          {
            type: "LinkedIn",
            value: "https://www.linkedin.com/in/naiarafxmartins/",
          },
        ],
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
