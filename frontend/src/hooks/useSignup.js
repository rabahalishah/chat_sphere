import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    //Validating the data first, before sending the data to APIs
    const success = handleInputError({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) {
      return;
    }

    setLoading(true);

    //here once the data has successfully validated sending API request to create the user

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });

      const data = await res.json();
      console.log('data: ', data);

      if (data.error) {
        throw new Error(data.error);
      }

      //storing the user infor in local storage on signinup

      localStorage.setItem('chat-user', JSON.stringify(data));

      //updating the context
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputError({
  fullName,
  username,
  password,
  confirmPassword,
  gender,
}) {
  // checking in case user has sent any empty field
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error('Please fill in all fields');
    return false;
  }

  //making sure that password and confirm password are same
  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return false;
  }

  //making sure that is password is 6 character long
  if (password.length < 6) {
    toast.error('Passwords length must be at least 6 characters');
    return false;
  }

  //if all data is validate then return success status as true

  return true;
}
