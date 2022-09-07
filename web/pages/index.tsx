import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import axios from 'axios';


const Home: NextPage = () => {

  const onSubmit = (e:React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("refresh prevented");

    axios.get('https://ofztj4z2s7.execute-api.us-east-1.amazonaws.com/dev/guess_color?guess=123456')
      .then(function (response) {
        console.log(response);
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
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" onClick={onSubmit}/>
      </form>
    </div>
  )
}

export default Home
