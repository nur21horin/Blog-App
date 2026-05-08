export const Query = {
me:async (parent: any, args: any, { prisma, userInfo }: any) => {

},
users: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.user.findMany();
  },
  posts: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.post.findMany(
      {
        where:{
          published:true
        },
        oderBy:[
          {createdAt:"desc"}
        
        ]
      }
    );
  },
};
