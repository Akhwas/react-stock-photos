import React, { useState, useEffect,useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

const clientEndID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
function App() {
  
  const[loading,setLoading] = useState(false)
  const [photos,setPhotos] = useState([])
  const [page,setPage] = useState(1)
  const [query,setQuery] = useState('')
  const urlPage= `&page=${page}`
  const urlQuery = `&query=${query}`
  const mounted = useRef(false)
  const [newImages,setNewImages] = useState(false)
  const fetchImages = async()=>{
    let url
    if(query==='')
    {url = `${mainUrl}${clientEndID}${urlPage}`}
    else{url = `${searchUrl}${clientEndID}${urlPage}${urlQuery}`}

    setLoading(true)
    try {

      const response = await fetch(url)
      const data = await response.json()
      setPhotos(
        (oldPhotos)=>{
        if(query && page===1){
          return data.results
        }
        else if(query){
          
           return [...oldPhotos,...data.results]}
        else{
          return [...oldPhotos,...data]
        }})
      console.log(data)
      setNewImages(false)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }

  }
  const submitHandle = (e)=>{
    e.preventDefault()
    if (!query) return
    if(page === 1){
      fetchImages()
      return
    }
    setPage(1)
  }

  useEffect(()=>{fetchImages()
    // eslint-disable-next-line
    
  },[page])

  useEffect(()=>{
    if(!mounted.current){
      mounted.current = true
      return
    }
    if(loading) return
    if(!newImages) return
    setPage((oldPage)=>oldPage + 1)
    
    // mounted.current = false
  },[newImages])

  const event = ()=>{
    if(window.innerHeight + window.scrollY >= document.body.scrollHeight - 3){
      setNewImages(true)
    }
  }

  useEffect(()=>{
    window.addEventListener('scroll',event)
    return ()=>window.removeEventListener('scroll',event)
  },[])
// had to remove this to fix the first page not rerendering bug
  // useEffect(()=>{
  //   const event = window.addEventListener('scroll',()=>{


  //     if(!loading && window.scrollY+window.innerHeight>= document.body.scrollHeight-10){
  //       setPage((page)=>{return page+1})
  //     }
  //   })
  //   return ()=> window.removeEventListener('scroll',event)
  //   // eslint-disable-next-line
  // },[])
  return <main>
    <section className='search'>
      <form className='search-form'>
        <input type='text' placeholder='search' className='form-input' value = {query} onChange = {(e)=>{setQuery(e.target.value)}}>

        </input>
        <button type='submit' className='submit-btn' onClick={submitHandle}>
          <FaSearch/>
        </button>
      </form>
    </section>
    <section className='photos'>
      <div className='photos-center'>
        {photos.map((photo,index)=>{
          return <Photo {...photo} key={index}/>
        })}
      </div>
      {loading&&<h2 className='loading'>loading...</h2>}
    </section>
  </main>
}

export default App
