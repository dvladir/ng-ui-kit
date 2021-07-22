pipeline {
  options {
    disableConcurrentBuilds()
  }

  agent {
    dockerfile {
      filename 'Dockerfile.build'
      args '-v /usr/src/app:/usr/src/app -w /usr/src/app --net=host'
    }
  }

  stages {
    stage("Install"){
      steps {
        withNPM(npmrcConfig: 'dev-npm-rc') {
          sh "yarn"
        }
      }
    }
    stage("Build") {
      steps {
        sh "yarn build-lib"
      }
    }
    stage("Test") {
      steps {
        sh "yarn test-lib"
      }
    }
    stage("Publish") {
      steps {
        dir('dist/dvladir/ng-ui-kit') {
          withNPM(npmrcConfig: 'dev-npm-rc-publish') {
            sh "yarn publish --access public --non-interactive --verbose"
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
