const HASHNODE_API = 'https://gql.hashnode.com'
const PUBLICATION_ID = '699c1d54d8339ef337716926'

export async function getAllPosts() {
  try {
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

    if (data.errors) {
      console.error('Hashnode API Errors:', data.errors);
      return [];
    }

    if (!data.data?.publication) {
      console.error('Publication not found with ID:', PUBLICATION_ID);
      // Fallback: try by common host if ID fails (for debugging)
      return [];
    }

    return data.data.publication.posts.edges.map(e => e.node)
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
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

    if (data.errors) {
      console.error('Hashnode API Post Errors:', data.errors);
      return null;
    }

    return data.data?.publication?.post || null;
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return null;
  }
}