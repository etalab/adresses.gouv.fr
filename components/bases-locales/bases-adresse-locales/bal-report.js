import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../section'

import Report from '../validator/report'

import Header from './dataset/header'

class BalReport extends React.Component {
  render() {
    const {report, organization} = this.props
    return (
      <Section>
        <Header name={organization.name} logo={organization.logo} />
        <Report report={report} />
      </Section>
    )
  }
}

BalReport.propTypes = {
  organization: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired
  }).isRequired,
  report: PropTypes.object.isRequired
}

export default BalReport
