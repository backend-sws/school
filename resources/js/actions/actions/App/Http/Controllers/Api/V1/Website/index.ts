import SliderController from './SliderController'
import NewsController from './NewsController'
import GalleryController from './GalleryController'
import GalleryImageController from './GalleryImageController'
import TickerController from './TickerController'

const Website = {
    SliderController: Object.assign(SliderController, SliderController),
    NewsController: Object.assign(NewsController, NewsController),
    GalleryController: Object.assign(GalleryController, GalleryController),
    GalleryImageController: Object.assign(GalleryImageController, GalleryImageController),
    TickerController: Object.assign(TickerController, TickerController),
}

export default Website