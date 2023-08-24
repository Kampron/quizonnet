'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';
import escapeStringRegexp from 'escape-string-regexp';
import axios from 'axios';

const PromptCardList = ({ data }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post, index) => (
        <PromptCard key={index} post={post} />
      ))}
    </div>
  );
};

const Feed = () => {
  //  Search State
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/questions');
      const data = response.data;

      setPosts(data); // Assuming setPosts is defined elsewhere
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchText) => {
    const regexPatterns = searchText.split(/\s+/).map((word) => {
      const escapedWord = escapeStringRegexp(word);
      return `(?=.*${escapedWord})`;
    });
    const regexPattern = `^${regexPatterns.join('')}`;

    const regex = new RegExp(regexPattern, 'i'); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) =>
        regex.test(item.search) ||
        regex.test(item.subject) ||
        regex.test(item.month) ||
        regex.test(item.year) ||
        regex.test(item.type)
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  //  const handleTagClick = (tagName) => {
  //     setSearchText(tagName)

  //     const searchResult = filterPrompts(tagName)
  //     setSearchedResults(searchResult)
  //   }

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a subject, month or year"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* { Alll Prompts } */}

      {searchText && <PromptCardList data={searchedResults} />}
      {/* {searchText ? (
        <PromptCardList
        data={searchedResults}
        // handleTagClick={handleTagClick}
      />
      ) : (
        <PromptCardList
        data={posts}
        // handleTagClick={handleTagClick}
      />
      )}      */}
    </section>
  );
};

export default Feed;
