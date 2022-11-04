export default {
  methods: {
    sanitizeSections() {
      this.sections.forEach((section) => {
        if (!section.sanitized) {
          switch (section.type) {
            case 'cards':
            case 'info':
            case 'info-cards':
              section.cards.forEach((card) => {
                if (card.image.src.indexOf('/assets') !== 1) {
                  card.image.src = require(`~/assets/images/${
                    card.image.src.split('/assets/images/')[1]
                  }`)
                }
              })
              break
            case 'hero':
            case 'pictorial':
              if (section.image && section.image.src.indexOf('/assets') !== 1) {
                section.image.src = require(`~/assets/images/${
                  section.image.src.split('/assets/images/')[1]
                }`)
              }
              break
            case 'news':
              section.images.forEach((image) => {
                if (image.src.indexOf('/assets') !== 1) {
                  image.src = require(`~/assets/images/${
                    image.src.split('/assets/images/')[1]
                  }`)
                }
              })
              break
            case 'gallery':
            case 'videoGallery':
            case 'carousel':
              section.media.forEach((mediaItem) => {
                if (mediaItem.src.indexOf('/assets') !== 1) {
                  mediaItem.src = require(`~/assets/images/${
                    mediaItem.src.split('/assets/images/')[1]
                  }`)
                }
              })
              break
          }

          if (section.cta && !section.cta.color) {
            switch (section.background) {
              case 'white':
              case 'lighter':
                this.$set(section.cta, 'color', 'primary')
                break
              case 'light':
              case 'dark':
                this.$set(section.cta, 'color', 'secondary')
                break
            }
          }

          section.sanitized = true
        }
      })
    },
  },
}
