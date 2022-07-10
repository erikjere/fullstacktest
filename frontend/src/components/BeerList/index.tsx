import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../Card'
import BeerItem from '../BeerItem'
import classes from './BeerList.module.css'

const BeerList: React.FC<{
  onLogout: () => void
  onLogin: (name: string, page: number) => void
  isLoggedIn: boolean
  username: string | null
}> = (props) => {
  const { onLogin, onLogout, username, isLoggedIn } = props
  const params = useParams()
  const navigate = useNavigate()
  const isPageNumber = !isNaN(Number(params.pageNumber))
  const pn =
    isPageNumber &&
    0 < Number(params.pageNumber) &&
    Number(params.pageNumber) < 14
      ? Number(params.pageNumber)
      : 1

  const [pageNumber, setPageNumber] = useState(pn)
  const [beerData, setBeerData] = useState([{}])

  useEffect(() => {
    const getBeerData = async (link: string) => {
      const response = await fetch(link)
      const data = await response.json()
      setBeerData(data)
    }

    const loggedInCheck = async () => {
      if (document.cookie.startsWith('token=')) {
        const token = document.cookie.split('=')[1]
        const response = await fetch('http://localhost:5000/tokenLogin', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (data.status === 'login successful') {
          onLogin(data.data, Number(params.pageNumber))
        }
      }
    }

    const getBeerLink = async (pageNumber: number) => {
      const token = document.cookie.split('=')[1]
      const response = await fetch('http://localhost:5000/beerList', {
        headers: {
          Authorization: `Bearer ${token}`,
          pageNumber: JSON.stringify(pageNumber),
        },
      })
      const data = await response.json()
      getBeerData(data)
    }

    if (!isLoggedIn) {
      loggedInCheck()
    }
    if (isLoggedIn) {
      getBeerLink(pageNumber)
    }
  }, [pageNumber, isLoggedIn, onLogin, params.pageNumber])

  if (!isLoggedIn) {
    // could be a redirect, but this seems like more fun :)
    return (
      <Card>
        <div className={classes.center}>
          <h1>Hey, you aren't supposed to be here!</h1>
          <p>Please Login before trying to see all the Beer</p>
          <Link to="/login">Login</Link>
        </div>
      </Card>
    )
  }

  const logoutHandler = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  const nextPage = () => {
    setPageNumber((currentPageNumber) => currentPageNumber + 1)
    navigate(`/beers/${pageNumber + 1}`, { replace: false })
  }

  const previousPage = () => {
    setPageNumber((currentPageNumber) => currentPageNumber - 1)
    navigate(`/beers/${pageNumber - 1}`, { replace: false })
  }

  return (
    <Card>
      <h1 className={classes.center}>Hi, {username}!</h1>
      <p className={classes.center}>
        Here you will find our finest beer selection.
      </p>
      <button className={classes.button} onClick={logoutHandler}>
        Logout
      </button>
      {beerData.length > 1 && (
        <ul className={classes.list}>
          {beerData.map((beer: any): any => (
            <BeerItem key={beer.id} name={beer.name} />
          ))}
        </ul>
      )}
      <div className={classes.navigation}>
        {pageNumber > 1 && (
          <button className={classes.previous} onClick={previousPage}>
            Previous
          </button>
        )}
        <button className={classes.next} onClick={nextPage}>
          Next
        </button>
        <p className={classes.counter}>{pageNumber}</p>
      </div>
    </Card>
  )
}

export default BeerList
