pipeline {
    agent any
    stages {
        stage('Pull docker image') {
            // agent {
            //     docker {
            //         image 'node:24-alpine'
            //         reuseNode true
            //     }
            // }
            steps {
                sh '''
                npm --version
                node --version
                '''
            }
        }
    }
}
