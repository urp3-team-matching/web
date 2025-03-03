import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const posts = await prisma.post.findMany()

  return (
    <div className="container">
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          </div>
      ))}
    </div>
  );
}
