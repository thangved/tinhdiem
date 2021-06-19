
const tableGrades = document.getElementById('tableGrades')
const addButton = document.getElementById('addButton')
const removeButton = document.getElementById('removeButton')
const calculateButton = document.getElementById('calculateButton')
const chartValues = document.querySelectorAll('.chartValue')
const average = document.querySelector('.average')

var chartValue = 'polarArea'

addButton.addEventListener('click', event => addItem(event))
removeButton.addEventListener('click', event => removeItem(event))
calculateButton.addEventListener('click', event => calculate(event))


chartValues.forEach(item => {
    item.addEventListener('click', event => {
        chartValues.forEach(item => {
            item.classList.remove('active')
        })
        item.classList.add('active')
        chartValue = item.getAttribute('value')
        calculate()
    })
})


function addItem() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
            <td><input class="form-control grades-title" type="text"></td>
            <td><input class="form-control grades-value" type="number"></td>
            <td><input class="form-control grades-weight" type="number"></td>
            <td><input readonly class="form-control grades-text" type="text"></td>
            `
    tableGrades.querySelector('tbody').append(tr)
}

function removeItem() {
    let tbody = tableGrades.querySelector('tbody')
    let trlist = tbody.querySelectorAll('tr')
    if (trlist.length == 1) return
    trlist[trlist.length - 1].remove()
}

function calculate() {
    const data = getData()
    const dataString = JSON.stringify(data)
    axios.get("/grades/" + dataString)
        .then(res => {
            var data = res.data
            if (typeof (data) == "string") {
                toastMess(data)
                return
            }
            drawChart(data)
            appendGradeTexts(data)
            average.innerHTML = String(data.average).slice(0,4)
            
        })
}

function getData() {
    var titles = []
    var values = []
    var weights = []
    var grades = []

    document.querySelectorAll('.grades-title').forEach(title => {
        titles.push(title.value)
    })
    document.querySelectorAll('.grades-value').forEach(value => {
        values.push(value.value)
    })
    document.querySelectorAll('.grades-weight').forEach(weight => {
        weights.push(weight.value)
    })

    titles.forEach((title, index) => {
        grades.push({
            title: titles[index],
            value: values[index],
            weight: weights[index]
        })
    })

    return grades
}

function drawChart(data) {
    // xoa chart cu
    const oldChart = document.querySelector('canvas')
    oldChart.remove()

    // tao chart moi
    const newChart = document.createElement('canvas')
    document.querySelector('#chartjs').append(newChart)

    var labels = []
    var dataList = []
    var colorBgList = []

    var Data = data.data
    var weight = data.weights

    Data.forEach(data => {
        labels.push(data.title + ` (${data.weight + 'chỉ'} x ${data.grade} điểm)`)
        dataList.push((data.grade * data.weight))
        colorBgList.push(`rgba(${Math.floor(Math.random() * 255)}, 255, ${Math.floor(Math.random() * 255)}, 1)`)
    })

    var dataChart = {
        labels: labels,
        datasets: [{
            label: 'Điểm',
            data: dataList,
            backgroundColor: colorBgList,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
        }]
    }

    const config = {
        type: chartValue,
        data: dataChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    }

    var myChart = new Chart(
        newChart,
        config
    )
}
function appendGradeTexts(data){
    var grtext = tableGrades.querySelectorAll('.grades-text')
    grtext.forEach((gr, index) => {
        gr.value = data.data[index].text
    })
}

function toastMess(mess){
    var toastMess = document.createElement('div')
    toastMess.classList.add('toastMess')
    toastMess.innerHTML = mess
    document.body.append(toastMess)
    setTimeout(()=>{
        toastMess.remove()
    }, 2000)
}