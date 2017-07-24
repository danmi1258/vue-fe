import onlineTraining from 'views/training/onlineTraining'

import VideoAnalyse from 'views/training/video/analyse'
import VideoStock from 'views/training/video/stock'
import VideoTeaching from 'views/training/video/teaching'

import EducationalBooks from 'views/training/booksMagazines/educationalBooks'
import moneyTheory from 'views/training/booksMagazines/moneyTheory'

export default [{
  path: 'training/online-training',
  component: onlineTraining,
  meta: {
    requiresAuth: true
  }
}, {
  path: 'training/books-magazines/money-theory',
  component: moneyTheory,
  meta: {
    requiresAuth: true
  }
}, {
  path: 'training/books-magazines/educational-books',
  component: EducationalBooks,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/training/videos/stock',
  component: VideoStock,
  meta: {
    requiresAuth: true
  },

}, {
  path: '/training/videos/analyse',
  component: VideoAnalyse,
  meta: {
    requiresAuth: true
  },
},{
  path: '/training/videos/teaching',
  component: VideoTeaching,
  meta: {
    requiresAuth: true
  }
}];