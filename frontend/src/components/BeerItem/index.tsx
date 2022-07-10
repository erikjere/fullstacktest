import classes from './BeerItem.module.css'

const BeerItem: React.FC<{ key: number; name: string }> = (props) => {
  return <p className={classes.name}>{props.name}</p>
}

export default BeerItem
