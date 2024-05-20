import { cache } from 'react';

import db from '@/src/lib/database/db';
import { LatestPosts } from '@/src/lib/database/fetchTypes';
import { User, Yap } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class ActionError extends Error {}

const getLatestYaps = async (
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    if (date && id) {
      const posts = await db.$queryRaw<LatestPosts>`WITH combined_posts AS (
          SELECT 
              "Yap".id, 
              "Yap".text, 
              "Yap".image,
              "Yap".date, 
              'Yap' AS type, 
              NULL AS username,
              NULL AS yap,
              CASE 
                  WHEN u1.id IS NULL THEN NULL
                  ELSE JSON_BUILD_OBJECT(
                      'username', u1.username,
                      'displayName', u1."displayName",
                      'image', u1.image,
                      'joinDate', u1."joinDate"
                  )
              END AS author,
              JSON_BUILD_OBJECT(
                  'likes', COUNT(DISTINCT l.id),
                  'echoes', COUNT(DISTINCT e.id),
                  'replies', COUNT(DISTINCT r.id)
              ) AS _count,
              CASE 
                  WHEN "ParentYap".id IS NULL THEN NULL
                  ELSE JSON_BUILD_OBJECT(
                      'id', "ParentYap".id,
                      'text', "ParentYap".text,
                      'date', "ParentYap".date,
                      'image', "ParentYap".image,
                      'authorId', "ParentYap"."authorId",
                      'isReply', "ParentYap"."isReply",
                      'author', JSON_BUILD_OBJECT(
                          'username', u2.username,
                          'displayName', u2."displayName",
                          'image', u2.image,
                          'joinDate', u2."joinDate"
                      )
                  )
              END AS "parentYap"
          FROM "Yap"
          LEFT JOIN "Like" l ON "Yap".id = l."yapId"
          LEFT JOIN "Echo" e ON "Yap".id = e."yapId"
          LEFT JOIN "Yap" r ON "Yap".id = r."parentYapId"
          LEFT JOIN "User" u1 ON "Yap"."authorId" = u1.id
          LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
          LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
          GROUP BY "Yap".id, "Yap".text, "Yap".image, "Yap".date, u1.id, u1.username, u1."displayName", u1.image, u1."joinDate", 
                  "ParentYap".id, "ParentYap".text, "ParentYap".date, "ParentYap".image, "ParentYap"."authorId", 
                  "ParentYap"."isReply", "ParentYap"."parentYapId", u2.username, u2."displayName", u2.image, u2."joinDate"
          UNION ALL
          SELECT 
              "Echo".id::VARCHAR, 
              NULL AS text,
              NULL AS image,
              "Echo".date, 
              'Echo' AS type, 
              "Echo"."username",
              JSON_BUILD_OBJECT(
                  'id', "Yap".id,
                  'text', "Yap".text,
                  'date', "Yap".date,
                  'image', "Yap".image,
                  'imageKey', "Yap"."imageKey",
                  'isReply', "Yap"."isReply",
                  'parentYap', CASE 
                      WHEN "ParentYap".id IS NULL THEN NULL
                      ELSE JSON_BUILD_OBJECT(
                          'id', "ParentYap".id,
                          'text', "ParentYap".text,
                          'date', "ParentYap".date,
                          'image', "ParentYap".image,
                          'authorId', "ParentYap"."authorId",
                          'isReply', "ParentYap"."isReply",
                          'author', JSON_BUILD_OBJECT(
                              'username', u2.username,
                              'displayName', u2."displayName",
                              'image', u2.image,
                              'joinDate', u2."joinDate"
                          )
                      )
                  END,
                  'author', JSON_BUILD_OBJECT(
                      'username', u4.username,
                      'displayName', u4."displayName",
                      'image', u4.image,
                      'joinDate', u4."joinDate"
                  ),
                  '_count', JSON_BUILD_OBJECT(
                      'likes', COUNT(DISTINCT l.id),
                      'echoes', COUNT(DISTINCT e.id),
                      'replies', COUNT(DISTINCT r.id)
                  )
              ) AS yap,
              NULL AS author,
              NULL AS _count,
              NULL AS "parentYap"
          FROM "Echo"
          JOIN "Yap" ON "Echo"."yapId" = "Yap".id
          LEFT JOIN "Like" l ON "Yap".id = l."yapId"
          LEFT JOIN "Echo" AS e ON "Yap".id = e."yapId"
          LEFT JOIN "Yap" AS r ON "Yap".id = r."parentYapId"
          LEFT JOIN "User" u3 ON "Echo"."username" = u3.username
          LEFT JOIN "User" u4 ON "Yap"."authorId" = u4.id
          LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
          LEFT JOIN "User" u5 ON "ParentYap"."authorId" = u5.id
          LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
          GROUP BY "Echo".id, "Echo".date, "Echo"."username", u3.id, u3.username, 
                  u3."displayName", u3.image, u3."joinDate", "Yap".id, "Yap".text, 
                  "Yap".date, "Yap".image, "Yap"."imageKey", "Yap"."authorId", 
                  "Yap"."isReply", "Yap"."parentYapId", u4.username, 
                  u4."displayName", u4.image, u4."joinDate", "ParentYap".id, 
                  "ParentYap".text, "ParentYap".date, "ParentYap".image, 
                  "ParentYap"."authorId", "ParentYap"."isReply", 
                  "ParentYap"."parentYapId", u5.username, u5."displayName", 
                  u5.image, u5."joinDate", u2.username, u2."displayName", 
                  u2.image, u2."joinDate"
      )
      SELECT * FROM combined_posts
      WHERE (date, id::VARCHAR) < (${date}, ${id})
      ORDER BY date DESC, id DESC
      LIMIT 20;
    `;

      return { posts };
    }
    const posts = await db.$queryRaw<LatestPosts>`WITH combined_posts AS (
        SELECT 
            "Yap".id, 
            "Yap".text, 
            "Yap".image,
            "Yap".date, 
            'Yap' AS type, 
            NULL AS username,
            NULL AS yap,
            CASE 
                WHEN u1.id IS NULL THEN NULL
                ELSE JSON_BUILD_OBJECT(
                    'username', u1.username,
                    'displayName', u1."displayName",
                    'image', u1.image,
                    'joinDate', u1."joinDate"
                )
            END AS author,
            JSON_BUILD_OBJECT(
                'likes', COUNT(DISTINCT l.id),
                'echoes', COUNT(DISTINCT e.id),
                'replies', COUNT(DISTINCT r.id)
            ) AS _count,
            CASE 
                WHEN "ParentYap".id IS NULL THEN NULL
                ELSE JSON_BUILD_OBJECT(
                    'id', "ParentYap".id,
                    'text', "ParentYap".text,
                    'date', "ParentYap".date,
                    'image', "ParentYap".image,
                    'authorId', "ParentYap"."authorId",
                    'isReply', "ParentYap"."isReply",
                    'author', JSON_BUILD_OBJECT(
                        'username', u2.username,
                        'displayName', u2."displayName",
                        'image', u2.image,
                        'joinDate', u2."joinDate"
                    )
                )
            END AS "parentYap"
        FROM "Yap"
        LEFT JOIN "Like" l ON "Yap".id = l."yapId"
        LEFT JOIN "Echo" e ON "Yap".id = e."yapId"
        LEFT JOIN "Yap" r ON "Yap".id = r."parentYapId"
        LEFT JOIN "User" u1 ON "Yap"."authorId" = u1.id
        LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
        LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
        GROUP BY "Yap".id, "Yap".text, "Yap".image, "Yap".date, u1.id, u1.username, u1."displayName", u1.image, u1."joinDate", 
                "ParentYap".id, "ParentYap".text, "ParentYap".date, "ParentYap".image, "ParentYap"."authorId", 
                "ParentYap"."isReply", "ParentYap"."parentYapId", u2.username, u2."displayName", u2.image, u2."joinDate"
        UNION ALL
        SELECT 
            "Echo".id::VARCHAR, 
            NULL AS text,
            NULL AS image,
            "Echo".date, 
            'Echo' AS type, 
            "Echo"."username",
            JSON_BUILD_OBJECT(
                'id', "Yap".id,
                'text', "Yap".text,
                'date', "Yap".date,
                'image', "Yap".image,
                'imageKey', "Yap"."imageKey",
                'isReply', "Yap"."isReply",
                'parentYap', CASE 
                    WHEN "ParentYap".id IS NULL THEN NULL
                    ELSE JSON_BUILD_OBJECT(
                        'id', "ParentYap".id,
                        'text', "ParentYap".text,
                        'date', "ParentYap".date,
                        'image', "ParentYap".image,
                        'authorId', "ParentYap"."authorId",
                        'isReply', "ParentYap"."isReply",
                        'author', JSON_BUILD_OBJECT(
                            'username', u2.username,
                            'displayName', u2."displayName",
                            'image', u2.image,
                            'joinDate', u2."joinDate"
                        )
                    )
                END,
                'author', JSON_BUILD_OBJECT(
                    'username', u4.username,
                    'displayName', u4."displayName",
                    'image', u4.image,
                    'joinDate', u4."joinDate"
                ),
                '_count', JSON_BUILD_OBJECT(
                    'likes', COUNT(DISTINCT l.id),
                    'echoes', COUNT(DISTINCT e.id),
                    'replies', COUNT(DISTINCT r.id)
                )
            ) AS yap,
            NULL AS author,
            NULL AS _count,
            NULL AS "parentYap"
        FROM "Echo"
        JOIN "Yap" ON "Echo"."yapId" = "Yap".id
        LEFT JOIN "Like" l ON "Yap".id = l."yapId"
        LEFT JOIN "Echo" AS e ON "Yap".id = e."yapId"
        LEFT JOIN "Yap" AS r ON "Yap".id = r."parentYapId"
        LEFT JOIN "User" u3 ON "Echo"."username" = u3.username
        LEFT JOIN "User" u4 ON "Yap"."authorId" = u4.id
        LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
        LEFT JOIN "User" u5 ON "ParentYap"."authorId" = u5.id
        LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
        GROUP BY "Echo".id, "Echo".date, "Echo"."username", u3.id, u3.username, 
                u3."displayName", u3.image, u3."joinDate", "Yap".id, "Yap".text, 
                "Yap".date, "Yap".image, "Yap"."imageKey", "Yap"."authorId", 
                "Yap"."isReply", "Yap"."parentYapId", u4.username, 
                u4."displayName", u4.image, u4."joinDate", "ParentYap".id, 
                "ParentYap".text, "ParentYap".date, "ParentYap".image, 
                "ParentYap"."authorId", "ParentYap"."isReply", 
                "ParentYap"."parentYapId", u5.username, u5."displayName", 
                u5.image, u5."joinDate", u2.username, u2."displayName", 
                u2.image, u2."joinDate"
    )
    SELECT * FROM combined_posts
    ORDER BY date DESC, id DESC
    LIMIT 20;
  `;

    return { posts };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      console.error('ERROR:', err);
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
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    const user = await db.user.findUnique({
      where: { username: currentUsername },
      select: { following: { select: { id: true } } },
    });

    if (!user || !user.following.length) {
      return { noFollowing: 'No user or no followers found.' };
    }

    const { following } = user;

    if (!date && !id) {
      const yaps = await db.yap.findMany({
        where: {
          author: {
            id: { in: [...following.map((user) => user.id)] },
          },
        },
        take: 20,
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
        orderBy: {
          date: 'desc',
        },
      });

      return { yaps };
    }
    const yaps = await db.yap.findMany({
      where: {
        author: {
          id: { in: [...following.map((user) => user.id)] },
        },
      },
      take: 20,
      cursor: {
        date,
        id,
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
      orderBy: {
        date: 'desc',
      },
    });

    return { yaps };
  } catch (err) {
    console.log('FOLLOW ERR:', err);
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
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
      // console.log('Prisma error:', err);
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

const getUserProfile = cache(async (username: string) => {
  try {
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
            followers: true,
            following: true,
          },
        },
      },
    });

    return { user };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERPROFILE ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
});

const getUserProfileYaps = async (
  username: string,
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    if (date && id) {
      const yaps = await db.yap.findMany({
        skip: 1,
        take: 20,
        cursor: {
          date,
          id,
        },
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
    }
    const yaps = await db.yap.findMany({
      take: 20,
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
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERPROFILEYAPS ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileMedia = async (
  username: string,
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    if (date && id) {
      const yaps = await db.yap.findMany({
        skip: 1,
        take: 20,
        cursor: {
          date,
          id,
        },
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
    }
    const yaps = await db.yap.findMany({
      take: 20,
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
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERPROFILEMEDIA ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileLikes = async (
  username: string,
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    if (date && id) {
      const likes = await db.like.findMany({
        skip: 1,
        take: 20,
        cursor: {
          date,
          id: parseInt(id),
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

      return { likes };
    }
    const likes = await db.like.findMany({
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

    return { likes };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERPROFILELIKES ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileEchoes = async (
  username: string,
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    if (date && id) {
      const echoes = await db.echo.findMany({
        take: 20,
        skip: 1,
        cursor: {
          date,
          id: parseInt(id),
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
    }
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
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERPROFILEECHOES ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getUserProfileYapsAndEchoes = async (
  username: string,
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    if (date && id) {
      const posts = await db.$queryRaw<LatestPosts>`WITH combined_posts AS (
        SELECT 
            "Yap".id, 
            "Yap".text, 
            "Yap".image,
            "Yap".date, 
            'Yap' AS type, 
            NULL AS username,
            NULL AS yap,
            CASE 
                WHEN u1.id IS NULL THEN NULL
                ELSE JSON_BUILD_OBJECT(
                    'username', u1.username,
                    'displayName', u1."displayName",
                    'image', u1.image,
                    'joinDate', u1."joinDate"
                )
            END AS author,
            JSON_BUILD_OBJECT(
                'likes', COUNT(DISTINCT l.id),
                'echoes', COUNT(DISTINCT e.id),
                'replies', COUNT(DISTINCT r.id)
            ) AS _count,
            CASE 
                WHEN "ParentYap".id IS NULL THEN NULL
                ELSE JSON_BUILD_OBJECT(
                    'id', "ParentYap".id,
                    'text', "ParentYap".text,
                    'date', "ParentYap".date,
                    'image', "ParentYap".image,
                    'authorId', "ParentYap"."authorId",
                    'isReply', "ParentYap"."isReply",
                    'author', JSON_BUILD_OBJECT(
                        'username', u2.username,
                        'displayName', u2."displayName",
                        'image', u2.image,
                        'joinDate', u2."joinDate"
                    )
                )
            END AS "parentYap"
        FROM "Yap"
        LEFT JOIN "Like" l ON "Yap".id = l."yapId"
        LEFT JOIN "Echo" e ON "Yap".id = e."yapId"
        LEFT JOIN "Yap" r ON "Yap".id = r."parentYapId"
        LEFT JOIN "User" u1 ON "Yap"."authorId" = u1.id
        LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
        LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
        WHERE u1.username = ${username}
        GROUP BY "Yap".id, "Yap".text, "Yap".image, "Yap".date, u1.id, u1.username, u1."displayName", u1.image, u1."joinDate", 
                "ParentYap".id, "ParentYap".text, "ParentYap".date, "ParentYap".image, "ParentYap"."authorId", 
                "ParentYap"."isReply", "ParentYap"."parentYapId", u2.username, u2."displayName", u2.image, u2."joinDate"
        UNION ALL
        SELECT 
            "Echo".id::VARCHAR, 
            NULL AS text,
            NULL AS image,
            "Echo".date, 
            'Echo' AS type, 
            "Echo"."username",
            JSON_BUILD_OBJECT(
                'id', "Yap".id,
                'text', "Yap".text,
                'date', "Yap".date,
                'image', "Yap".image,
                'imageKey', "Yap"."imageKey",
                'isReply', "Yap"."isReply",
                'parentYap', CASE 
                    WHEN "ParentYap".id IS NULL THEN NULL
                    ELSE JSON_BUILD_OBJECT(
                        'id', "ParentYap".id,
                        'text', "ParentYap".text,
                        'date', "ParentYap".date,
                        'image', "ParentYap".image,
                        'authorId', "ParentYap"."authorId",
                        'isReply', "ParentYap"."isReply",
                        'author', JSON_BUILD_OBJECT(
                            'username', u2.username,
                            'displayName', u2."displayName",
                            'image', u2.image,
                            'joinDate', u2."joinDate"
                        )
                    )
                END,
                'author', JSON_BUILD_OBJECT(
                    'username', u4.username,
                    'displayName', u4."displayName",
                    'image', u4.image,
                    'joinDate', u4."joinDate"
                ),
                '_count', JSON_BUILD_OBJECT(
                    'likes', COUNT(DISTINCT l.id),
                    'echoes', COUNT(DISTINCT e.id),
                    'replies', COUNT(DISTINCT r.id)
                )
            ) AS yap,
            NULL AS author,
            NULL AS _count,
            NULL AS "parentYap"
        FROM "Echo"
        JOIN "Yap" ON "Echo"."yapId" = "Yap".id
        LEFT JOIN "Like" l ON "Yap".id = l."yapId"
        LEFT JOIN "Echo" AS e ON "Yap".id = e."yapId"
        LEFT JOIN "Yap" AS r ON "Yap".id = r."parentYapId"
        LEFT JOIN "User" u3 ON "Echo"."username" = u3.username
        LEFT JOIN "User" u4 ON "Yap"."authorId" = u4.id
        LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
        LEFT JOIN "User" u5 ON "ParentYap"."authorId" = u5.id
        LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
        WHERE u3.username = ${username}
        GROUP BY "Echo".id, "Echo".date, "Echo"."username", u3.id, u3.username, 
                u3."displayName", u3.image, u3."joinDate", "Yap".id, "Yap".text, 
                "Yap".date, "Yap".image, "Yap"."imageKey", "Yap"."authorId", 
                "Yap"."isReply", "Yap"."parentYapId", u4.username, 
                u4."displayName", u4.image, u4."joinDate", "ParentYap".id, 
                "ParentYap".text, "ParentYap".date, "ParentYap".image, 
                "ParentYap"."authorId", "ParentYap"."isReply", 
                "ParentYap"."parentYapId", u5.username, u5."displayName", 
                u5.image, u5."joinDate", u2.username, u2."displayName", 
                u2.image, u2."joinDate"
    )
    SELECT * FROM combined_posts
    WHERE (date, id::VARCHAR) < (${date}, ${id})
    ORDER BY date DESC, id DESC
    LIMIT 20;
    `;

      return { posts };
    }

    const posts = await db.$queryRaw<LatestPosts>`WITH combined_posts AS (
      SELECT 
          "Yap".id, 
          "Yap".text, 
          "Yap".image,
          "Yap".date, 
          'Yap' AS type, 
          NULL AS username,
          NULL AS yap,
          CASE 
              WHEN u1.id IS NULL THEN NULL
              ELSE JSON_BUILD_OBJECT(
                  'username', u1.username,
                  'displayName', u1."displayName",
                  'image', u1.image,
                  'joinDate', u1."joinDate"
              )
          END AS author,
          JSON_BUILD_OBJECT(
              'likes', COUNT(DISTINCT l.id),
              'echoes', COUNT(DISTINCT e.id),
              'replies', COUNT(DISTINCT r.id)
          ) AS _count,
          CASE 
              WHEN "ParentYap".id IS NULL THEN NULL
              ELSE JSON_BUILD_OBJECT(
                  'id', "ParentYap".id,
                  'text', "ParentYap".text,
                  'date', "ParentYap".date,
                  'image', "ParentYap".image,
                  'authorId', "ParentYap"."authorId",
                  'isReply', "ParentYap"."isReply",
                  'author', JSON_BUILD_OBJECT(
                      'username', u2.username,
                      'displayName', u2."displayName",
                      'image', u2.image,
                      'joinDate', u2."joinDate"
                  )
              )
          END AS "parentYap"
      FROM "Yap"
      LEFT JOIN "Like" l ON "Yap".id = l."yapId"
      LEFT JOIN "Echo" e ON "Yap".id = e."yapId"
      LEFT JOIN "Yap" r ON "Yap".id = r."parentYapId"
      LEFT JOIN "User" u1 ON "Yap"."authorId" = u1.id
      LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
      LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
      WHERE u1.username = ${username}
      GROUP BY "Yap".id, "Yap".text, "Yap".image, "Yap".date, u1.id, u1.username, u1."displayName", u1.image, u1."joinDate", 
              "ParentYap".id, "ParentYap".text, "ParentYap".date, "ParentYap".image, "ParentYap"."authorId", 
              "ParentYap"."isReply", "ParentYap"."parentYapId", u2.username, u2."displayName", u2.image, u2."joinDate"
      UNION ALL
      SELECT 
          "Echo".id::VARCHAR, 
          NULL AS text,
          NULL AS image,
          "Echo".date, 
          'Echo' AS type, 
          "Echo"."username",
          JSON_BUILD_OBJECT(
              'id', "Yap".id,
              'text', "Yap".text,
              'date', "Yap".date,
              'image', "Yap".image,
              'imageKey', "Yap"."imageKey",
              'isReply', "Yap"."isReply",
              'parentYap', CASE 
                  WHEN "ParentYap".id IS NULL THEN NULL
                  ELSE JSON_BUILD_OBJECT(
                      'id', "ParentYap".id,
                      'text', "ParentYap".text,
                      'date', "ParentYap".date,
                      'image', "ParentYap".image,
                      'authorId', "ParentYap"."authorId",
                      'isReply', "ParentYap"."isReply",
                      'author', JSON_BUILD_OBJECT(
                          'username', u2.username,
                          'displayName', u2."displayName",
                          'image', u2.image,
                          'joinDate', u2."joinDate"
                      )
                  )
              END,
              'author', JSON_BUILD_OBJECT(
                  'username', u4.username,
                  'displayName', u4."displayName",
                  'image', u4.image,
                  'joinDate', u4."joinDate"
              ),
              '_count', JSON_BUILD_OBJECT(
                  'likes', COUNT(DISTINCT l.id),
                  'echoes', COUNT(DISTINCT e.id),
                  'replies', COUNT(DISTINCT r.id)
              )
          ) AS yap,
          NULL AS author,
          NULL AS _count,
          NULL AS "parentYap"
      FROM "Echo"
      JOIN "Yap" ON "Echo"."yapId" = "Yap".id
      LEFT JOIN "Like" l ON "Yap".id = l."yapId"
      LEFT JOIN "Echo" AS e ON "Yap".id = e."yapId"
      LEFT JOIN "Yap" AS r ON "Yap".id = r."parentYapId"
      LEFT JOIN "User" u3 ON "Echo"."username" = u3.username
      LEFT JOIN "User" u4 ON "Yap"."authorId" = u4.id
      LEFT JOIN "Yap" AS "ParentYap" ON "Yap"."parentYapId" = "ParentYap".id
      LEFT JOIN "User" u5 ON "ParentYap"."authorId" = u5.id
      LEFT JOIN "User" u2 ON "ParentYap"."authorId" = u2.id
      WHERE u3.username = ${username}
      GROUP BY "Echo".id, "Echo".date, "Echo"."username", u3.id, u3.username, 
              u3."displayName", u3.image, u3."joinDate", "Yap".id, "Yap".text, 
              "Yap".date, "Yap".image, "Yap"."imageKey", "Yap"."authorId", 
              "Yap"."isReply", "Yap"."parentYapId", u4.username, 
              u4."displayName", u4.image, u4."joinDate", "ParentYap".id, 
              "ParentYap".text, "ParentYap".date, "ParentYap".image, 
              "ParentYap"."authorId", "ParentYap"."isReply", 
              "ParentYap"."parentYapId", u5.username, u5."displayName", 
              u5.image, u5."joinDate", u2.username, u2."displayName", 
              u2.image, u2."joinDate"
  )
  SELECT * FROM combined_posts
  ORDER BY date DESC, id DESC
  LIMIT 20;
  `;

    console.log(posts);
    return { posts };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERPROFILEYAPSANDECHOES ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getNotifications = async (
  username: string,
  date: string | undefined = undefined,
  id: string | undefined = undefined
) => {
  try {
    await db.user.update({
      where: {
        username,
      },
      data: {
        newNotifications: null,
      },
    });
    if (date && id) {
      const notifications = await db.notification.findMany({
        skip: 1,
        take: 20,
        cursor: {
          date,
          id: parseInt(id),
        },
        where: {
          username,
        },
        include: {
          author: {
            select: {
              image: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return { notifications };
    }

    const notifications = await db.notification.findMany({
      take: 20,
      where: {
        username,
      },
      include: {
        author: {
          select: {
            image: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return { notifications };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETNOTIFICATIONS ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getLiked = cache(async (id: Yap['id'], username: string) => {
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
    // //   console.log('Prisma error:', err);
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

const getEchoed = cache(async (id: Yap['id'], username: string) => {
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
    // //   console.log('Prisma error:', err);
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
      // //   console.log('Prisma error:', err);
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

const getUsers = async (id: string | undefined = undefined) => {
  try {
    if (id) {
      const users = await db.user.findMany({
        skip: 1,
        take: 20,
        cursor: {
          id,
        },
        select: {
          id: true,
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
      take: 20,
      select: {
        id: true,
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
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETUSERS ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getSearch = async (
  query: string,
  id: User['id'] | undefined = undefined
) => {
  try {
    if (query === '') return { yaps: undefined };

    console.log(query);

    if (!id) {
      const yaps = await db.yap.findMany({
        take: 20,
        where: {
          text: {
            search: query.split(' ').join(','),
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
      take: 20,
      skip: 1,
      cursor: {
        id,
      },
      where: {
        text: {
          search: query.split(' ').join(','),
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
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETSEARCH ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getFollowers = async (
  username: string,
  id: string | undefined = undefined
) => {
  try {
    if (id) {
      const user = await db.user.findUnique({
        where: {
          username,
        },
        select: {
          followers: {
            skip: 1,
            take: 20,
            cursor: {
              id,
            },
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
              joinDate: true,
            },
          },
        },
      });

      return { followers: user?.followers };
    }
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        followers: {
          take: 20,
          select: {
            id: true,
            username: true,
            displayName: true,
            image: true,
            joinDate: true,
          },
        },
      },
    });

    return { followers: user?.followers };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETFOLLOWERS ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

const getFollowing = async (
  username: string,
  id: User['id'] | undefined = undefined
) => {
  try {
    if (!id) {
      const user = await db.user.findUnique({
        where: {
          username,
        },
        select: {
          following: {
            take: 20,
            select: {
              username: true,
              displayName: true,
              image: true,
              joinDate: true,
            },
          },
        },
      });

      return { following: user?.following };
    }
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        following: {
          take: 20,
          skip: 1,
          cursor: {
            id,
          },
          select: {
            username: true,
            displayName: true,
            image: true,
            joinDate: true,
          },
        },
      },
    });

    return { following: user?.following };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    console.error('GETFOLLOWING ERROR:', err);
    return { error: 'Unknown error occured.' };
  }
};

export {
  getEchoed,
  getFollowers,
  getFollowing,
  getFollowingYaps,
  getIsFollowing,
  getLatestYaps,
  getLiked,
  getNotifications,
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
