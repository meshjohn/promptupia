"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchedParams = useSearchParams();
  const userName = searchedParams.get('name');
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchedPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();
      setUserPosts(data);
    }
    if(params?.id) fetchedPosts();
  }, [params.id]);
  return(
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
