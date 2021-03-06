import React from 'react';
import NavbarContainer from './notfoundcomponents/NavbarContainer'
import ContentContainer from './notfoundcomponents/ContentContainer'
import InstagramContainer from './notfoundcomponents/InstagramContainer'
import FooterContainer from './notfoundcomponents/FooterContainer'
import ApiKey from '../ApiKey'

class NotFound extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            nav_collapsed: true,
            news_email: '',
            news_status: '',
            instagram_posts: [],
        }
        this.toggleNavbar = this.toggleNavbar.bind(this)
        this.postData = this.postData.bind(this)
        this.updateEmail = this.updateEmail.bind(this)
        this.decodeEntities = this.decodeEntities.bind(this)
    }

    componentDidMount() {
        fetch('http://165.22.144.213:8000/wp-json/wp/v2/posts?orderby=date')
        .then(response => response.json())
        .then(data => {
            this.setState({ posts: data })
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            throw error
        })
        fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token=6238699054.2f3c5b2.74aa9d9e31824f20b6244ae437d43561')
        .then(response => response.json())
        .then(data => {
            this.setState({ instagram_posts: data.data})
        })
    }

    toggleNavbar() {
        this.setState({ nav_collapsed: !this.state.nav_collapsed })
    }

    postData(event){
        event.preventDefault()
        let subscriber = JSON.stringify({"email_address": this.state.news_email, "status": "subscribed"})
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        fetch(proxyUrl + 'https://us17.api.mailchimp.com/3.0/lists/8e0d01458b/members', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
              'Authorization': 'ApiKey ' + ApiKey,
              'Content-Type': 'application/json'
          },
          body: subscriber
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
          if (data.email_address != null) {
            this.setState({news_status: 'success'})
          }
          if (data.status === 400) {
            this.setState({news_status: 'failure'})
          }
        })
      }

    updateEmail(event){
        this.setState({news_email: event.target.value})
        console.log(event.target.value)
    }

    decodeEntities = (function() {
        // this prevents any overhead from creating the object each time
        var element = document.createElement('div');
      
        function decodeHTMLEntities (str) {
          if(str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
          }
      
          return str;
        }
      
        return decodeHTMLEntities;
      })();

    render() {
        return (
            <div>
                <NavbarContainer toggleNavbar={this.toggleNavbar} nav_collapsed={this.state.nav_collapsed}/>
                <ContentContainer decodeEntities={this.decodeEntities} next_post={this.state.next_post} prev_post={this.state.prev_post} news_status={this.state.news_status} updateEmail={this.updateEmail} postData={this.postData} loading={this.state.loading} posts={this.state.posts} posts_page={this.state.posts_page} changePostsPage={this.changePostsPage} active_post={this.state.active_post}/>
                <InstagramContainer instagram_posts={this.state.instagram_posts}/>
                <FooterContainer/>
            </div>
        )
    }
}

export default NotFound;