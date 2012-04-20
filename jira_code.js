var timer_buttons = document.createElement('ul'); 
timer_buttons.className = 'first ops'; 
timer_buttons.id = 'timer_buttons'; 
timer_buttons.innerHTML = '<li><a id="start-button" class="button first">Toggle timer</a></li><li class="last" style="position: relative"><a id="task-selector" class="button more last drop"><span id="current-task">Task name</span><span class="icon drop-menu"></span></a><div id="harvest-tasks" style="display: none; position: absolute; top: 21px; left: 0px"></div></li>';
var menu = document.getElementsByClassName('ops-cont')[0];
menu.appendChild(timer_buttons);
timer_buttons.style.opacity = "0.5";
var start_button = document.getElementById('start-button');
start_button.style.backgroundImage = 'url(' + chrome.extension.getURL('time.png') + ')';
start_button.addEventListener('click', function() {
  var task_name = document.getElementById('current-task').innerText;
  var fix_version = document.getElementById('fixfor-val').innerText.trim();
  chrome.extension.sendRequest({start: document.location.href, task_name: task_name, project: fix_version}, function(response) {
    update(response);
  });
});
document.getElementById('task-selector').addEventListener('click', function() {
  var selector = document.getElementById('harvest-tasks')
  selector.style.display = (selector.style.display == 'block') ? 'none' : 'block';
});

var fix_version = document.getElementById('fixfor-val').innerText.trim();
chrome.extension.sendRequest({update: document.location.href, project: fix_version}, function(response) {
  update(response);
});

function update(response) {
  document.getElementById('timer_buttons').style.opacity = "1";
  if (response.setState.error) {
    document.getElementById('timer_buttons').innerHTML = response.setState.error+' - check your <a target="_blank" href="'+chrome.extension.getURL('options.html')+'">options</a>?';
  } else {
    var el = document.getElementById('start-button');
    el.innerText = response.setState.buttonText;
    var task_list = document.createElement('div');
    for (var i=0; i < response.setState.project.tasks.length; i++) {
      var item = document.createElement('a');
      item.innerText = response.setState.project.tasks[i].name;
      item.addEventListener('click', function() {
        document.getElementById('current-task').innerText = this.innerText;
        document.getElementById('harvest-tasks').style.display = 'none';
      });
      task_list.appendChild(item);
    }
    var task_parent = document.getElementById('harvest-tasks');
    task_parent.innerHTML = '';
    task_parent.appendChild(task_list);
    document.getElementById('harvest-tasks').appendChild(task_list);
    if (response.setState.current) {
      document.getElementById('current-task').innerText = response.setState.current;
    } else {
      document.getElementById('current-task').innerText = response.setState.project.tasks[0].name;
    }
  }
}
