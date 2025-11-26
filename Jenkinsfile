pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: test
    image: alpine
    command: ["sleep", "99"]
    tty: true
'''
        }
    }

    stages {
        stage('Check Kubernetes Pod') {
            steps {
                container('test') {
                    sh 'echo "KUBERNETES AGENT WORKING"'
                }
            }
        }
    }
}
