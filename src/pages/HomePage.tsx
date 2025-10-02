import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { PLAYBOOK_TEMPLATES, Playbook, Resource, isBuiltInTemplate } from '@/data/templates';
import { storageService } from '@/services/storage';

export function HomePage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(PLAYBOOK_TEMPLATES);
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const fetchPlaybooks = async () => {
    try {
      // Start with templates
      const templates = [...PLAYBOOK_TEMPLATES];
      
      // Try to fetch user-created playbooks from R2
      try {
        const userPlaybooks = await storageService.getAllPlaybooks();
        setPlaybooks([...templates, ...userPlaybooks]);
      } catch (error) {
        // If API is not available, just use templates
        console.log('Using templates only (API not available)');
        setPlaybooks(templates);
      }
    } catch (error) {
      console.error('Error fetching playbooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaybooks();
  }, []);

  const handleDelete = async (playbookId: string, playbookTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${playbookTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await storageService.deletePlaybook(playbookId);
      notifications.show({
        title: 'Success',
        message: 'Playbook deleted successfully',
        color: 'green',
      });
      // Refresh the list
      fetchPlaybooks();
    } catch (error) {
      console.error('Failed to delete playbook:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete playbook. Please try again.',
        color: 'red',
      });
    }
  };

  const isTemplate = (id: string) => isBuiltInTemplate(id);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading playbooks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Playbooks</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {playbooks.map((playbook) => (
              <div key={playbook.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all">
                <div className="mb-3">
                  <div className="flex items-start justify-between">
                    <Link
                      to={`/playbook/${playbook.id}`}
                      className="text-left flex-1 group pr-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                        {playbook.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 relative z-10">
                      {!isTemplate(playbook.id) && (
                        <>
                          <Link
                            to={`/editor?edit=${playbook.id}`}
                            className="p-2 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            title="Edit playbook"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(playbook.id, playbook.title);
                            }}
                            className="p-2 rounded transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete playbook"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {playbook.description.length > 100 
                      ? `${playbook.description.substring(0, 100)}...` 
                      : playbook.description
                    }
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {isTemplate(playbook.id) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Built-in Template
                      </span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {playbook.escalationPaths.length} path{playbook.escalationPaths.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/playbook/${playbook.id}`}
                    className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Getting Started</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Learn how to create and manage your AI validation playbooks
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Create a new playbook</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
                  <Link to="/editor" className="text-primary dark:text-secondary hover:text-primary/80 dark:hover:text-secondary/80">
                    Click here to create your first playbook
                  </Link>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  <button
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                    className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <span>Learn about validation</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </dt>
                {resourcesOpen && (
                  <dd className="mt-3 sm:mt-0">
                    <div className="space-y-3">
                      {PLAYBOOK_TEMPLATES[0].resources?.map((resource: Resource, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                          <div className="flex-1 min-w-0">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-secondary transition-colors"
                            >
                              {resource.title}
                            </a>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {resource.description}
                            </p>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Open link"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </dd>
                )}
              </div>
            </dl>
          </div>
      </div>
    </div>
  );
}
