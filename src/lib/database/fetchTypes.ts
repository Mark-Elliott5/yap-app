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
        joinDate: string;
        image: string | null;
      };
      parentYap: {
        author: {
          displayName: string | null;
          username: string | null;
          joinDate: string;
          image: string | null;
        };
        id: string;
        text: string | null;
        date: string;
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
      id: string;
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
        date: string;
        image: string | null;
        isReply: boolean;
        author: {
          displayName: string | null;
          username: string | null;
          joinDate: string;
          image: string | null;
        };
        parentYap: {
          id: string;
          text: string | null;
          date: string;
          image: string | null;
          isReply: boolean;
          author: {
            displayName: string | null;
            username: string | null;
            joinDate: string;
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
