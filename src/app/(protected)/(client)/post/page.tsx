import { getCurrentUsername } from '@/src/lib/database/getUser';
import CreatePostForm from '@/src/components/yap/CreatePostForm';

async function PostPage() {
  const currentUsername = await getCurrentUsername();
  return <CreatePostForm currentUser={currentUsername} />;
}

export default PostPage;
