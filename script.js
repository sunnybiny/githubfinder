// GitHub API 요청을 처리하는 클래스
class GitHub { 

    constructor() { // 클래스 생성자
        this.base_url = 'https://api.github.com/users/'; // GitHub 사용자의 기본 URL 설정
    }

    // 사용자의 이름을 받으면 프로필, 레포지토리 정보를 가져오는 메서드
    async getUser(username) {
        const profileResponse = await fetch(`${this.base_url}${username}`); // 프로필 정보 가져오기
        const profile = await profileResponse.json();

        const reposResponse = await fetch(`${this.base_url}${username}/repos`); // 레포지토리 정보 가져오기
        const repos = await reposResponse.json(); // 비동기함수 응답을 기다리기 (await)

        return { profile, repos }; // 프로필 정보, 레포지토리 정보를 객체 형태로 반환
    }
}

// UI 업데이트를 처리하는 클래스
class UI {
    showProfile(user) { // 프로필 정보를 HTML 형태로 변환하는 메서드
        const profileHTML = `
        <div class="card card-body mb-3">
        <div class="row">
            <div class="col-md-3">
                <img class="img-fluid mb-2" src="${user.avatar_url}">
                <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
            </div>
            <div class="col-md-9">
                <span class="badge bg-primary">Public Repos: ${user.public_repos}</span>
                <span class="badge bg-secondary">Public Gists: ${user.public_gists}</span>
                <span class="badge bg-success">Followers: ${user.followers}</span>
                <span class="badge bg-info">Following: ${user.following}</span>
                <br><br>
                <ul class="list-group">
                    <li class="list-group-item">Company: ${user.company}</li>
                    <li class="list-group-item">Website/Blog: ${user.blog}</li>
                    <li class="list-group-item">Location: ${user.location}</li>
                    <li class="list-group-item">Member Since: ${user.created_at}</li>
                </ul>
            </div>
        </div>
    </div>
`;
        document.getElementById('profile').innerHTML = profileHTML;
    }

    showRepos(repos) {
        let reposHTML = '<h3 class="page-heading mb-3">Latest Repos</h3>';
        repos.forEach(repo => {
            reposHTML += `
                <div class="card card-body mb-2">
                    <div class="row">
                        <div class="col-md-6">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        <div class="col-md-6">
                            <span class="badge bg-primary">Stars: ${repo.stargazers_count}</span>
                            <span class="badge bg-secondary">Watchers: ${repo.watchers_count}</span>
                            <span class="badge bg-success">Forks: ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById('profile').innerHTML += reposHTML;
    }

    showAlert(message, className) {
        // 이전에 존재하는 경고 메시지 제거
        this.clearAlert();
    
        // 경고 메시지 생성
        const div = document.createElement('div');
        div.className = className;
        div.appendChild(document.createTextNode(message));
    
        // 경고 메시지를 페이지에 추가
        const container = document.querySelector('.SearchContainer');
        const search = document.querySelector('.search');
        container.insertBefore(div, search);
    
        // 3초 후 경고 메시지 제거
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }
    
    clearAlert() {
        const currentAlert = document.querySelector('.alert');
        if (currentAlert) {
            currentAlert.remove();
        }
    }
    


}

// GitHub 클래스의 인스턴스 생성
const github = new GitHub();

// UI 클래스 인스턴스 생성
const ui = new UI(); 

// Event Listeners: 사용자가 버튼을 클릭하면 함수 실행
document.getElementById('searchBtn').addEventListener('click', () => {

    // 사용자가 입력한 텍스트 가져오기
    const userText = document.getElementById('searchUser').value;
    
    if (userText !== '') { // 빈 문자열인지 확인
        github.getUser(userText) // github 클래스의 getUser 메소드
            .then(data => {
                if (data.profile.message === 'Not Found') { // UI에서 사용자가 발견되지 않았다는 메시지 표시
                    ui.showAlert(data.profile.message, 'alert alert-danger'); // 경고 메시지 표시
                } else { 
                    ui.showProfile(data.profile); // 사용자 프로필 정보 표시
                    ui.showRepos(data.repos); // 사용자 레포지토리 정보 표시
                }
            });
    }
});

