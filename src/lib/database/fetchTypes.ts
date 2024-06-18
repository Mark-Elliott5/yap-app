export type LatestPosts = (
  | {
      id: string;
      text: string | null;
      image: string | null;
      isReply: boolean;
      date: Date;
      type: 'Yap';
      yap: null;
      author: {
        displayName: string | null;
        username: string | null;
        joinDate: Date;
        image: string | null;
      };
      parentYap: {
        author: {
          displayName: string | null;
          username: string | null;
          joinDate: Date;
          image: string | null;
        };
        id: string;
        text: string | null;
        date: Date;
        image: string | null;
        imageKey: string | null;
        isReply: boolean;
      } | null;
      _count: {
        likes: number;
        echoes: number;
        replies: number;
      };
    }
  | {
      id: number;
      text: null;
      image: null;
      type: 'Echo';
      username: string;
      date: Date;
      author: null;
      _count: null;
      parentYap: null;
      yap: {
        id: string;
        text: string | null;
        date: Date;
        image: string | null;
        isReply: boolean;
        author: {
          displayName: string | null;
          username: string | null;
          joinDate: Date;
          image: string | null;
        };
        parentYap: {
          id: string;
          text: string | null;
          date: Date;
          image: string | null;
          isReply: boolean;
          author: {
            displayName: string | null;
            username: string | null;
            joinDate: Date;
            image: string | null;
          };
        } | null;
        _count: {
          likes: number;
          echoes: number;
          replies: number;
        };
      };
    }
)[];
