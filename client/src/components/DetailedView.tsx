import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import Modal from "./Modal";

interface DetailedViewProps {
  postId: number;
  setIsDetailedView: React.Dispatch<React.SetStateAction<number | null>>;
  refetchAllPosts: () => void;
}

type Author = {
  id: number;
  name: string;
};

type Comment = {
  id: number;
  content: string;
  author: Author;
};

const GET_SINGLE_POST = gql`
  query GetSinglePost($postId: ID!) {
    getPostById(postId: $postId) {
      id
      title
      content
      author {
        id
        name
      }
      comments {
        id
        content
        author {
          id
          name
        }
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!, $authorId: ID!) {
    addComment(postId: $postId, content: $content, authorId: $authorId) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

function DetailedView({
  postId,
  setIsDetailedView,
  refetchAllPosts,
}: DetailedViewProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>("");

  const [addComment, { loading: mutationLoading, error: mutationError }] =
    useMutation(ADD_COMMENT);

  const handleUpdate = () => {
    setIsModalOpen(true);
  };

  const { loading, error, data, refetch } = useQuery(GET_SINGLE_POST, {
    variables: { postId: postId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data.getPostById;

  const handleCommentSubmit = () => {
    // We are using 'authorId' of the person who wrote post, in future there should be authorization
    addComment({
      variables: {
        postId: post.id,
        content: commentContent,
        authorId: post.author.id,
      },
    }).then(() => {
      setCommentContent("");
      refetch();
    });
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
      {isModalOpen && (
        <Modal
          type="POST"
          operation={"UPDATE"}
          defaultData={post}
          onClose={() => setIsModalOpen(false)}
          refetch={() => {
            refetchAllPosts();
            refetch();
          }}
        />
      )}
      <button
        className="absolute top-2 right-2 text-2xl leading-none p-1 text-gray-700 hover:text-gray-900"
        onClick={() => setIsDetailedView(null)}
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-600 mb-4">
        Written by: <span className="font-semibold">{post.author.name}</span>
      </p>

      <button
        onClick={handleUpdate}
        className="px-2 py-1 bg-blue-500 text-white rounded mb-4"
      >
        Update Post
      </button>

      <div className="mb-8 border-l-4 border-blue-500 pl-4">{post.content}</div>

      <h3 className="text-xl font-semibold mb-4">Comments:</h3>
      <ul className="space-y-4">
        {post.comments.map((comment: Comment) => (
          <li key={comment.id} className="border-t border-gray-200 pt-4">
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-gray-600 mt-2">
              - by <span className="font-semibold">{comment.author.name}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <textarea
          className="w-full p-2 rounded-md border border-gray-300 mb-4"
          placeholder="Add a comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
          onClick={handleCommentSubmit}
          disabled={mutationLoading}
        >
          {mutationLoading ? "Posting..." : "Post Comment"}
        </button>
        {mutationError && (
          <p className="text-red-500 mt-2">Error posting comment.</p>
        )}
      </div>
    </div>
  );
}

export default DetailedView;
