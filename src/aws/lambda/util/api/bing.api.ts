import axios, { type AxiosRequestConfig } from 'axios'

const getLatestNews = async () => {
  const url = 'https://api.bing.microsoft.com/v7.0/news/search'

  const config: AxiosRequestConfig = {
    params: {
      mkt: 'en-MY',
      setLang: 'en',
      q: 'maybank', // malaysia%20stock
      count: '100',
      sortby: 'date',
      freshness: 'day',
      since: new Date().getTime() - 7200
    },
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
    }
  }

  try {
    const response = await axios.get(url, config)
    const { value } = response.data
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: value
      })
    }
  } catch (err) {
    console.log(err)
    return err
  }
}

export { getLatestNews }
