import { cache } from 'react';

import db from '@/src/lib/database/db';
import { Echo, User, Yap } from '@prisma/client';
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
              // id: true,
            },
          },
          parentYap: {
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

      const echoes = await db.echo.findMany({
        take: 10,
        include: {
          yap: {
            include: {
              author: {
                select: {
                  displayName: true,
                  username: true,
                  image: true,
                  joinDate: true,
                },
              },
              parentYap: {
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
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return { yaps, echoes };
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
            // id: true,
          },
        },
        parentYap: {
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

const getFollowingYaps = async (
  currentUsername: string,
  yapId: Yap['id'] | undefined = undefined,
  echoId: Echo['id'] | undefined = undefined
) => {
  try {
    console.log('Getting following yaps');
    // await getSession('Access denied.');

    const user = await db.user.findUnique({
      where: {
        username: currentUsername,
      },
      select: {
        following: {
          take: 100,
          select: {
            username: true,
          },
        },
      },
    });
    console.log(user);
    if (!user) {
      return { failure: 'No user or no followers found.' };
    }

    const { following } = user;

    if (!yapId) {
      const yaps = await db.yap.findMany({
        take: 10,
        where: {
          author: {
            username: {
              in: [...following.map(({ username }) => username!)],
            },
          },
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
              // id: true,
            },
          },
          parentYap: {
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
      const echoes = await db.echo.findMany({
        take: 10,
        where: {
          username: {
            in: [...following.map(({ username }) => username!)],
          },
        },
        include: {
          yap: {
            include: {
              author: {
                select: {
                  displayName: true,
                  username: true,
                  image: true,
                  joinDate: true,
                },
              },
              parentYap: {
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
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return { yaps, echoes };
    }

    const yaps = await db.yap.findMany({
      skip: 1,
      take: 10,
      cursor: {
        id: yapId,
      },
      where: {
        author: {
          username: {
            in: [...following.map(({ username }) => username!)],
          },
        },
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
            // id: true,
          },
        },
        parentYap: {
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

    const echoes = await db.echo.findMany({
      skip: 1,
      take: 10,
      cursor: {
        id: echoId,
      },
      where: {
        username: {
          in: [...following.map(({ username }) => username!)],
        },
      },
      include: {
        yap: {
          include: {
            author: {
              select: {
                displayName: true,
                username: true,
                image: true,
                joinDate: true,
              },
            },
            parentYap: {
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
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return { yaps, echoes };
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
          orderBy: {
            date: 'asc',
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
            _count: {
              select: {
                echoes: true,
                likes: true,
                replies: true,
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
            id: true,
          },
        },
        parentYap: {
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

const getUserProfile = cache(async (username: User['username']) => {
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
});

const getUserProfileYaps = async (username: User['username']) => {
  try {
    if (!username) {
      throw new ActionError('No post USERNAME was received by the server.');
    }

    const yaps = await db.yap.findMany({
      where: {
        author: {
          username,
        },
      },
      omit: {
        parentYapId: true,
        authorId: true,
      },
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
            image: true,
            joinDate: true,
            // id: true,
          },
        },
        parentYap: {
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
      orderBy: {
        date: 'desc',
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
    console.log(err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileMedia = async (username: User['username']) => {
  try {
    if (!username) {
      throw new ActionError('No username was received by the server.');
    }

    const yaps = await db.yap.findMany({
      where: {
        author: {
          username,
        },
        NOT: {
          image: null,
        },
      },
      omit: {
        parentYapId: true,
        authorId: true,
      },
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
            image: true,
            joinDate: true,
            // id: true,
          },
        },
        parentYap: {
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
      orderBy: {
        date: 'desc',
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
    console.log(err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileLikes = async (
  username: User['username'],
  id: Yap['id'] | undefined = undefined
) => {
  try {
    if (!username) {
      throw new ActionError('No username was received by the server.');
    }

    if (!id) {
      const yaps = await db.yap.findMany({
        take: 20,
        where: {
          likes: {
            some: {
              username,
            },
          },
        },
        omit: {
          parentYapId: true,
          authorId: true,
        },
        include: {
          author: {
            select: {
              displayName: true,
              username: true,
              image: true,
              joinDate: true,
              // id: true,
            },
          },
          parentYap: {
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
        orderBy: {
          date: 'desc',
        },
      });

      return { yaps };
    }
    const yaps = await db.yap.findMany({
      take: 20,
      skip: 1,
      cursor: {
        id,
      },
      where: {
        likes: {
          some: {
            username,
          },
        },
      },
      omit: {
        parentYapId: true,
        authorId: true,
      },
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
            image: true,
            joinDate: true,
            // id: true,
          },
        },
        parentYap: {
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
      orderBy: {
        date: 'desc',
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
    console.log(err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileEchoes = async (
  username: User['username'],
  id: Echo['id'] | undefined = undefined
) => {
  try {
    if (!username) {
      throw new ActionError('No username was received by the server.');
    }

    if (!id) {
      const echoes = await db.echo.findMany({
        take: 20,
        where: {
          username,
        },
        include: {
          yap: {
            include: {
              author: {
                select: {
                  displayName: true,
                  username: true,
                  image: true,
                  joinDate: true,
                  // id: true,
                },
              },
              parentYap: {
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
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return { echoes };
    }
    const echoes = await db.echo.findMany({
      take: 20,
      skip: 1,
      cursor: {
        id,
      },
      where: {
        username,
      },
      include: {
        yap: {
          include: {
            author: {
              select: {
                displayName: true,
                username: true,
                image: true,
                joinDate: true,
                // id: true,
              },
            },
            parentYap: {
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
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return { echoes };
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

const getUserProfileYapsAndEchoes = async (username: User['username']) => {
  try {
    if (!username) {
      throw new ActionError('No username was received by the server.');
    }

    const yapsAndEchoes = await db.user.findUnique({
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
        bio: true,
        displayName: true,
        joinDate: true,
        id: true,
        private: true,
        image: true,
        username: true,
      },
      include: {
        yaps: {
          include: {
            author: {
              select: {
                displayName: true,
                username: true,
                image: true,
                joinDate: true,
                // id: true,
              },
            },
            parentYap: {
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
          orderBy: {
            date: 'desc',
          },
        },
        echoes: {
          include: {
            yap: {
              include: {
                author: {
                  select: {
                    displayName: true,
                    username: true,
                    image: true,
                    joinDate: true,
                  },
                },
                parentYap: {
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
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return { yapsAndEchoes };
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

const getLiked = cache(async (id: Yap['id'], username: User['username']) => {
  try {
    if (!id) {
      throw new ActionError('No id was received by the server.');
    }

    const yap = await db.yap.findUnique({
      where: {
        id,
        AND: {
          likes: {
            some: {
              username,
            },
          },
        },
      },
    });

    return !!yap;
  } catch (err) {
    // if (err instanceof PrismaClientKnownRequestError) {
    //   console.log('Prisma error:', err);
    //   return { error: 'Something went wrong! Please try again.' };
    // }

    // if (err instanceof ActionError) {
    //   return { error: err.message };
    // }
    // // if (err instanceof PrismaClientKnownRequestError) {
    // //   return { error: 'Database error!' };
    // // }
    // console.log(err);
    // return { error: 'Unknown error occured.' };
    return false;
  }
});

const getEchoed = cache(async (id: Yap['id'], username: User['username']) => {
  try {
    if (!id) {
      throw new ActionError('No id was received by the server.');
    }

    const yap = await db.yap.findUnique({
      where: {
        id,
        AND: {
          echoes: {
            some: {
              username: username!,
            },
          },
        },
      },
    });

    return !!yap;
  } catch (err) {
    // if (err instanceof PrismaClientKnownRequestError) {
    //   console.log('Prisma error:', err);
    //   return { error: 'Something went wrong! Please try again.' };
    // }

    // if (err instanceof ActionError) {
    //   return { error: err.message };
    // }
    // // if (err instanceof PrismaClientKnownRequestError) {
    // //   return { error: 'Database error!' };
    // // }
    // console.log(err);
    // return { error: 'Unknown error occured.' };
    return false;
  }
});

const getIsFollowing = cache(
  async (username: string, currentUsername: string) => {
    try {
      if (!username) {
        throw new ActionError('No username was received by the server.');
      }
      if (!currentUsername) {
        throw new ActionError('No username was received by the server.');
      }

      const isFollowing = await db.user.findUnique({
        where: {
          username,
          AND: {
            followers: {
              some: {
                username: currentUsername,
              },
            },
          },
        },
      });

      return !!isFollowing;
    } catch (err) {
      // if (err instanceof PrismaClientKnownRequestError) {
      //   console.log('Prisma error:', err);
      //   return { error: 'Something went wrong! Please try again.' };
      // }

      // if (err instanceof ActionError) {
      //   return { error: err.message };
      // }
      // // if (err instanceof PrismaClientKnownRequestError) {
      // //   return { error: 'Database error!' };
      // // }
      // console.log(err);
      // return { error: 'Unknown error occured.' };
      return false;
    }
  }
);

const getUsers = async (id: User['id'] | undefined = undefined) => {
  try {
    if (!id) {
      const users = await db.user.findMany({
        take: 30,
        select: {
          displayName: true,
          username: true,
          image: true,
          joinDate: true,
        },
        orderBy: {
          joinDate: 'desc',
        },
      });

      return { users };
    }
    const users = await db.user.findMany({
      take: 30,
      skip: 1,
      cursor: {
        id,
      },
      select: {
        displayName: true,
        username: true,
        image: true,
        joinDate: true,
      },
      orderBy: {
        joinDate: 'desc',
      },
    });

    return { users };
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

const getSearch = async (
  query: string,
  id: User['id'] | undefined = undefined
) => {
  try {
    if (query === '') return { yaps: undefined };

    if (!id) {
      const yaps = await db.yap.findMany({
        take: 30,
        where: {
          text: {
            search: query,
          },
        },
        include: {
          author: {
            select: {
              displayName: true,
              username: true,
              image: true,
              joinDate: true,
              // id: true,
            },
          },
          parentYap: {
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
        orderBy: {
          date: 'desc',
        },
      });

      return { yaps };
    }

    const yaps = await db.yap.findMany({
      take: 30,
      skip: 1,
      cursor: {
        id,
      },
      where: {
        text: {
          search: query,
        },
      },
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
            image: true,
            joinDate: true,
            // id: true,
          },
        },
        parentYap: {
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
      orderBy: {
        date: 'desc',
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
    console.log(err);
    return { error: 'Unknown error occured.' };
  }
};

export {
  getEchoed,
  getFollowingYaps,
  getIsFollowing,
  getLatestYaps,
  getLiked,
  getSearch,
  getUserProfile,
  getUserProfileEchoes,
  getUserProfileLikes,
  getUserProfileMedia,
  getUserProfileYaps,
  getUserProfileYapsAndEchoes,
  getUsers,
  getYap,
};
