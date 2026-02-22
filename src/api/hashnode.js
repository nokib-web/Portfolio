const HASHNODE_API = 'https://gql.hashnode.com'
const PUBLICATION_ID = '699b73a496cb64f7286ca814'

export async function getAllPosts() {
    const res = await fetch(HASHNODE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query {
          publication(id: "${PUBLICATION_ID}") {
            posts(first: 50) {
              edges {
                node {
                  title
                  slug
                  brief
                  publishedAt
                  readTimeInMinutes
                  coverImage { url }
                  tags { name }
                }
              }
            }
          }
        }
      `
        })
    })
    const data = await res.json()
    return data.data.publication.posts.edges.map(e => e.node)
}

export async function getPostBySlug(slug) {
    const res = await fetch(HASHNODE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query {
          publication(id: "${PUBLICATION_ID}") {
            post(slug: "${slug}") {
              title
              publishedAt
              readTimeInMinutes
              coverImage { url }
              tags { name }
              content { html }
            }
          }
        }
      `
        })
    })
    const data = await res.json()
    return data.data.publication.post
}