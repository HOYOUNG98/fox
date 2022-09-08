import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useState } from 'react';


const Home: NextPage = () => {

  const [guess, setGuess] = useState("")
  const [response, setResponse] = useState("")
  const [guesses, setGuesses] = useState<Array<Array<string>>>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setGuess(e.target.value)
  }

  const onSubmit = (e:React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("refresh prevented");

    axios.get(`https://ofztj4z2s7.execute-api.us-east-1.amazonaws.com/dev/guess_color?guess=${guess}`)
      .then(function (response) {
        setResponse(response.data)
        setGuesses([[guess, response.data],...guesses])
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  
  return (
    <div className={styles.container}>

      <form>
        <label >
          Your Guess:
          <input type="text" name="name" value={guess} onChange={onChange}/>
        </label>
        <input type="submit" value="Submit" onClick={onSubmit}/>
        <div>{response}</div>

        <div >Your Guesses</div>
        {guesses.map((guess,idx)=> <div key={idx}>{guess}</div>)}
      </form>
    </div>
  )
}

export default Home
