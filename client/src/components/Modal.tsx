import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

type DataProps = {
  id?: number;
  authorId?: number;
  name?: string;
  email?: string;
  title?: string;
  content?: string;
  [key: string]: string | number | undefined;
};

type DataModalProps = {
  type: "USER" | "POST";
  operation: "CREATE" | "UPDATE";
  defaultData: DataProps | null;
  onClose: () => void;
  refetch: () => void;
};

const FIELDS_CONFIG = {
  USER: [
    { id: "name", label: "Name", placeholder: "Name", type: "text" },
    { id: "email", label: "Email", placeholder: "Email", type: "email" },
  ],
  POST: [
    { id: "title", label: "Title", placeholder: "Title", type: "text" },
    { id: "content", label: "Content", placeholder: "Content", type: "text" },
  ],
};

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const MUTATIONS = {
  USER: {
    CREATE: CREATE_USER,
    UPDATE: UPDATE_USER,
  },
  POST: {
    CREATE: CREATE_POST,
    UPDATE: UPDATE_POST,
  },
};

function Modal({
  type,
  operation,
  defaultData,
  onClose,
  refetch,
}: DataModalProps) {
  const [formData, setFormData] = useState(defaultData || {});

  const [mutateData] = useMutation(MUTATIONS[type][operation]);

  const handleSubmit = async () => {
    await mutateData({ variables: formData });
    refetch();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        {FIELDS_CONFIG[type].map((field) => (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            {field.id === "content" || field.id === "title" ? (
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                className={`mt-1 p-2 w-full border rounded-md ${
                  field.id === "content" ? "h-32" : "h16"
                }`}
                value={formData[field.id] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field.id]: e.target.value })
                }
              ></textarea>
            ) : (
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="mt-1 p-2 w-full border rounded-md"
                value={formData[field.id] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field.id]: e.target.value })
                }
              />
            )}
          </div>
        ))}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
