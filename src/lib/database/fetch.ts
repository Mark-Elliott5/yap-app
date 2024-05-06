import db from '@/src/lib/database/db';
import { User, Yap } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class ActionError extends Error {}

const getLatestYaps = async (id: Yap['id'] | undefined = undefined) => {
  try {
    console.log('Getting latest yaps');
    // await getSession('Access denied.');

    if (!id) {
      const yaps = await db.yap.findMany({
        take: 10,
        orderBy: {
          date: 'desc',
        },
        omit: {
          parentYapId: true,
          authorId: true,
        },
        include: {
          author: {
            select: {
              username: true,
              displayName: true,
              image: true,
              joinDate: true,
            },
          },
          parentYap: {
            omit: {
              text: true,
              image: true,
              date: true,
            },
            include: {
              author: {
                select: {
                  username: true,
                  displayName: true,
                  image: true,
                  joinDate: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              echoes: true,
              replies: true,
            },
          },
        },
      });

      return { yaps };
    }

    const yaps = await db.yap.findMany({
      skip: 1,
      take: 10,
      cursor: {
        id,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            image: true,
            joinDate: true,
          },
        },
        parentYap: {
          omit: {
            text: true,
            image: true,
            date: true,
          },
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
                image: true,
                joinDate: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            echoes: true,
            replies: true,
          },
        },
      },
    });

    return { yaps };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
  }
};

const getYap = async (id: Yap['id']) => {
  try {
    if (!id) {
      throw new ActionError('No post ID was received by the server.');
    }

    const yap = await db.yap.findUnique({
      where: {
        id,
      },
      omit: {
        parentYapId: true,
        authorId: true,
      },
      include: {
        replies: {
          omit: {
            authorId: true,
            parentYapId: true,
          },
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
                image: true,
                joinDate: true,
              },
            },
          },
        },
        author: {
          select: {
            username: true,
            displayName: true,
            image: true,
            joinDate: true,
          },
        },
        parentYap: {
          omit: {
            text: true,
            image: true,
            date: true,
          },
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
                image: true,
                joinDate: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            echoes: true,
          },
        },
      },
    });

    return { yap };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfile = async (username: User['username']) => {
  try {
    if (!username) {
      throw new ActionError('No post USERNAME was received by the server.');
    }

    const user = await db.user.findUnique({
      where: {
        username,
      },
      omit: {
        password: true,
        OAuth: true,
        name: true,
        email: true,
        emailVerified: true,
        imageKey: true,
        role: true,
      },
      include: {
        yaps: {
          include: {
            parentYap: {
              include: {
                author: {
                  select: {
                    username: true,
                    displayName: true,
                    joinDate: true,
                    image: true,
                  },
                },
              },
            },
            _count: {
              select: {
                likes: true,
                echoes: true,
                replies: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
        _count: {
          select: {
            yaps: true,
            echoes: true,
          },
        },
      },
    });

    return { user };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.log(err);
    return { error: 'Unknown error occured.' };
  }
};

export { getLatestYaps, getUserProfile, getYap };
