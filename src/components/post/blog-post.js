import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layout'
import withRoot from '../../withRoot'
import Paper from '../utils/paper'
import ScrollProgress from '../utils/scroll-progress'
import ColorfulTag from '../utils/hash-colorful-tag'
import getImageByName from '../utils/notion-hash-image'
import Disqus from 'disqus-react'
import { Helmet } from "react-helmet"
import { parseImageUrl } from 'notabase/src/utils'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'katex/dist/katex.min.css'
import '../../static/css/gist.css'

class BlogPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disqusShortname: undefined,
            disqusConfig: undefined
        }
    }

    componentDidMount() {
        const { data } = this.props
        // console.log(data)
        const post = data.posts
        const disqusShortname = data.siteConfig.commentDisqusShortname
        const disqusConfig = {
            url: window.location.href,
            identifier: window.location.pathname,
            title: post.name,
        }
        this.setState({
            disqusShortname,
            disqusConfig
        })

        // 检查hash，如果存在hash 则跳转到指定位置并高亮
        let hash = window.location.hash
        if (hash) {
            let blockID = hash.split('#')[1]
            let block = document.querySelector(`div[data-block-id="${blockID}"]`)
            if (block) {
                window.setTimeout(() => {
                    block.style.background = 'rgba(45, 170, 219, 0.3)'
                    block.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
                }, 1000);
            }
        }
    }

    render() {
        const { data } = this.props
        let siteConfig = data.siteConfig
        const { public_date,
            name,
            tags,
            html,
            slug,
            keywords,
            pformat,
        } = data.posts
        const { disqusShortname, disqusConfig } = this.state
        const seoKeywords = keywords ? keywords.join(" ") : ''
        let coverImageUrl

        if (pformat && pformat.page_cover) {
            let cover = pformat.page_cover
            coverImageUrl = parseImageUrl(cover)
        } else {
            coverImageUrl = getImageByName(slug)
        }
        return (

            <div>
                <ScrollProgress />
                <Layout navStyle={{ background: 'rgba(0,0,0,.05)' }} wrapStyle={{ marginTop: 0 }}>
                    <img style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        zIndex: 1
                    }} src={coverImageUrl} />
                    <Helmet defaultTitle={`${siteConfig.title} - ${name}`}>
                        <meta name="description" content={`${seoKeywords} ${name} mayne gine 博客 python react`} />
                    </Helmet>
                    <main style={{
                        maxWidth: 900,
                        margin: '0 auto',
                        marginTop: -100,
                        marginBottom: 100,
                        zIndex: 10
                    }} className="sticky">
                        <div role='meta' style={{ display: 'flex' }}>
                            <div style={{
                                background: '#eee',
                                color: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0,
                                height: '24px',
                                borderRadius: '3px',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                fontSize: '14px',
                                lineHeight: '120%',
                                fontWeight: '400',
                                margin: '0px 6px 6px 0px',
                            }}>{public_date}</div>
                            {
                                tags && tags.map(
                                    tag => <ColorfulTag tag={tag} key={tag} />)
                            }
                        </div>
                        <Paper>
                            <h1>{name}</h1>
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                            {
                                (data.siteConfig.commentOpen && disqusShortname && disqusConfig) && <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
                            }

                        </Paper>
                    </main>
                </Layout>
            </div>
        )
    }

}

export default withRoot(BlogPost)

export const query = graphql`

  query($slug: String!) {
    siteConfig {  
        title
        commentDisqusShortname
        commentOpen
    }
    posts(slug: { eq: $slug } ) {
        public_date
        name
        tags
        html
        slug
        keywords
    }
  }
`
