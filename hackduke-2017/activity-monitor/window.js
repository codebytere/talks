$(() => {
  const os = require('os')

  const datasets = []
  const cpus = os.cpus()

  for (let i = 0; i < cpus.length; i++) {
    const cpu = cpus[i]
    const cpuData = {
      data: [
        cpu.times.user,
        cpu.times.sys,
        cpu.times.idle,
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ]
    }
    datasets.push(cpuData)
  }

  var chart = new Chart($('.chart'), {
    type: 'doughnut',
    data: {
      labels: [
        'User Time (ms)',
        'System Time (ms)',
        'Idle Time (ms)'
      ],
      datasets: datasets
    },
    options: {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'CPU Activity',
        fontColor: 'rgb(250, 250, 250)',
        fontSize: 16
      },
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(250, 250, 250)',
          fontSize: 12
        }
      }
    }
  })
})