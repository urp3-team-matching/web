export async function getMessagesByProjectId(
  projectId: number
): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: { projectId },
    orderBy: { createdDatetime: "asc" },
  });
  return messages;
}
