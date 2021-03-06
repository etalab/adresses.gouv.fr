import React from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import MapBox from '@/components/mapbox'

import AddressesMap from '@/components/mapbox/addresses-map'

class Preview extends React.Component {
  static propTypes = {
    geojson: PropTypes.object,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    geojson: null
  }

  render() {
    const {geojson, children} = this.props

    return (
      <div className='preview-container'>
        <div className='content'>
          {children}

          <div className='preview-map-container'>
            {geojson && (
              <MapBox bbox={computeBbox(geojson)}>
                {({...mapboxProps}) => (
                  <AddressesMap
                    {...mapboxProps}
                    contour={geojson}
                  />
                )}
              </MapBox>
            )}
          </div>
        </div>

        <style jsx>{`
          .preview-container {
            margin: 2em 0;
          }

          .content {
            display: flex;
            justify-content: space-between;
          }

          .preview-map-container {
            width: 50%;
            height: 300px;
          }

          @media (max-width: 680px) {
            .content {
              flex-direction: column;
            }

            .map {
              width: 100%;
              margin: 1em 0;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Preview
