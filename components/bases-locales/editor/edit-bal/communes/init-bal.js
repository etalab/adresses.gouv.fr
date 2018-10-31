import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../styles/theme'

import Notification from '../../../../notification'

import SearchCommunes from './search-communes'

class InitBAL extends React.Component {
  static propTypes = {
    addCommune: PropTypes.func.isRequired
  }

  handleSubmit = async commune => {
    const {addCommune} = this.props

    await addCommune(commune)
  }

  render() {
    return (
      <div className='init-bal'>
        <div>
          <h3>Rechercher une commune</h3>
          <Notification type='info'>
            Pour initialiser la base, vous devez sélectionner les communes concernées.
          </Notification>
        </div>

        <SearchCommunes handleSelect={this.handleSubmit} />

        <style jsx>{`
          .init-bal {
            display: flex;
            flex-direction: column;
            border: 2px dashed ${theme.border};
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default InitBAL
