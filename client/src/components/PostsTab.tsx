import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import DetailedView from "./DetailedView";
import Modal from "./Modal";

const GET_ALL_POSTS = gql`
  query GetAllPosts($offset: Int, $limit: Int) {
    getAllPosts(offset: $offset, limit: $limit) {
      items {
        id
        title
        author {
          id
          name
        }
      }
      totalCount
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const POSTS_PER_PAGE = 10;

type Author = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  author: Author;
};

function PostsTab() {
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [deletePost] = useMutation(DELETE_POST);

  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS, {
    variables: { offset: (page - 1) * POSTS_PER_PAGE, limit: POSTS_PER_PAGE },
  });

  const itemsPerPage = 10;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalPages = Math.ceil(data.getAllPosts.totalCount / itemsPerPage);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (postId: number) => {
    await deletePost({ variables: { id: postId } });
    refetch();
  };

  if (selectedPostId) {
    return (
      <DetailedView
        postId={selectedPostId}
        setIsDetailedView={setSelectedPostId}
        refetchAllPosts={refetch}
      />
    );
  }

  return (
    <div>
      {isModalOpen && (
        <Modal
          type="POST"
          operation={"CREATE"}
          defaultData={null}
          onClose={() => setIsModalOpen(false)}
          refetch={refetch}
        />
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="text-left">
              <button
                onClick={handleCreate}
                className="px-2 py-1 bg-green-500 text-white rounded ml-4"
              >
                Create Post
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.getAllPosts.items.map((post: Post) => (
            <tr
              key={post.id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedPostId(post.id)}
            >
              <td className="py-2 px-4">{post.title}</td>
              <td className="py-2 px-4">{post.author.name}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300 ease-in-out"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  onMouseOver={(e) => e.stopPropagation()}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex mt-4">
        <button
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 transition-transform transform text-white ml-2 ${
            page === 1
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:scale-105"
          }`}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 transition-transform transform text-white ml-2 ${
            page >= totalPages
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:scale-105"
          } ml-2`}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PostsTab;
