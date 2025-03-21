import { Button } from '../ui/button'
import { StarIcon } from 'lucide-react'

const StarRating = ({ rating, handleRatingChange }) => {
  return [1, 2, 3, 4, 5].map((star) => {
    return (
      <Button
        className={`p-2 rounded-full transition-colors ${
          star <= rating ? 'text-yellow-500 hover:bg-black' : 'text-black hover:bg-primary text-primary-foreground'
        }`}
        onClick={handleRatingChange ? () => handleRatingChange(star) : null}
        variant="outline"
        size="icon"
      >
        <StarIcon className={`w-2 h-2 ${star <= rating ? 'fill-yellow-500' : 'fill-black'}`} />
      </Button>
    )
  })
}

export default StarRating
