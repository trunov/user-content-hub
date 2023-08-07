import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import UserModal from "./UserModal";

type User = {
  id: number;
  name: string;
  email: string;
};

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

function UsersTab() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<null | User>(null);

  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async (userId: number) => {
    await deleteUser({ variables: { id: userId } });
    refetch();
  };

  return (
    <table className="min-w-full bg-white">
      {isModalOpen && (
        <UserModal
          isEdit={!!selectedUser}
          defaultData={selectedUser}
          onClose={() => setIsModalOpen(false)}
          refetch={refetch}
        />
      )}
      <thead>
        <tr>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded transition duration-300 ease-in-out ml-4"
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          >
            Create User
          </button>
        </tr>
      </thead>
      <tbody>
        {data.getAllUsers.map((user: User) => (
          <tr key={user.id}>
            <td className="py-2 px-4">{user.name}</td>
            <td className="py-2 px-4">{user.email}</td>
            <td className="py-2 px-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2 transition duration-300 ease-in-out"
                onClick={() => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300 ease-in-out"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTab;
