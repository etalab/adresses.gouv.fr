import React from 'react'
import {UserCheck} from 'react-feather'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Validator from '../../components/bases-locales/validator'

const title = 'Le validateur BAL'

const ValidatorPage = () => (
  <Page>
    <Head title={title} icon={<UserCheck size={56} />} />
    <Validator />
  </Page>
)

export default ValidatorPage
