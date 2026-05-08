export const Profile = {
  user: async (parent: any, args: any, { prisma, userInfo }: any) => {
    return await prisma.post.findUnique({
      where: { id: parent.authorId },
    });
  },
};
