"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR, { mutate } from "swr";
import PromptCard from "./PromptCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const { data: allPosts, error } = useSWR("/api/prompt", fetcher);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = useCallback(
    (searchText) => {
      const regex = new RegExp(searchText, "i");
      return allPosts.filter(
        (item) =>
          regex.test(item.creator.username) ||
          regex.test(item.tag) ||
          regex.test(item.prompt)
      );
    },
    [allPosts]
  );

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        if (allPosts) {
          const searchResults = filterPrompts(e.target.value);
          setSearchedResults(searchResults);
        }
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    if (allPosts) {
      const searchResults = filterPrompts(tagName);
      setSearchedResults(searchResults);
    }
  };

  if (error) return <div>Failed to load</div>;
  if (!allPosts) return <div>Loading...</div>;

  return (
    <section className="feed">
      <form className="relative w-full flex-center ">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
