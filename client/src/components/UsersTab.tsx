import { useQuery, gql } from "@apollo/client";

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

function UsersTab() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Email</th>
        </tr>
      </thead>
      <tbody>
        {data.getAllUsers.map((user: User) => (
          <tr key={user.id}>
            <td className="py-2 px-4">{user.name}</td>
            <td className="py-2 px-4">{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTab;
