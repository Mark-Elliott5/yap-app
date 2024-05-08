import CreatePostForm from '@/src/components/yap/CreatePostForm';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function PostPage() {
  const currentUsername = await getCurrentUsername();
  return <CreatePostForm currentUser={currentUsername} />;
}

export default PostPage;
