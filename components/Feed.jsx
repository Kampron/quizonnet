'use client'

import { useState, useEffect } from 'react'

import PromptCard from "./PromptCard";

const PromptCardList = ({ data }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post, index) => (
        <PromptCard 
          key={index}
          post={post}
        />
      ))}
    </div>
  )
}


 
const Feed = () => {
  
  //  Search State
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [posts, setPosts] = useState([])


  const fetchPosts = async  () => {
      const response = await fetch('/api/questions')
      const data = await response.json()

      setPosts(data)
    }

  useEffect(() => {
    fetchPosts()
  }, [])


  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i"); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) => 
        regex.test(item.subject) ||
        regex.test(item.month) ||
        regex.test(item.year)  ||
        regex.test(item.type)  

    )
  }

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)
        setSearchedResults(searchResult)
      }, 500)
    )
  }

//  const handleTagClick = (tagName) => {
//     setSearchText(tagName)

//     const searchResult = filterPrompts(tagName)
//     setSearchedResults(searchResult)
//   }

  
  
  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          type='text'
          placeholder='Search for a subject, month or year'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
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
  )
}

export default Feed